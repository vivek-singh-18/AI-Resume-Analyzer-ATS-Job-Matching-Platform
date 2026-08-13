import Document from "../models/Document.js";
import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import { analyzeWithProvider } from "../utils/aiProvider.js";
import { getIO } from "../utils/socket.js";

const queue = [];
let running = false;
let initialized = false;

export const enqueue = async (docId) => {
  if (!queue.includes(docId)) queue.push(docId);
  processQueue();
};

const buildPrompt = (text, jobDescription = null) => {
  if (jobDescription) {
    return `
You are a resume analysis engine. Analyze the provided resume against the job description and return ONLY a valid JSON object:

{
  "summary": "string (100-200 words summarizing the resume fit)",
  "keyPoints": ["string", ...] (5-7 key strengths from resume),
  "sentiment": { "label": "positive|negative|neutral", "score": 0.0-1.0 },
  "keywords": ["string", ...] (top 10 relevant keywords from resume),
  "questions": ["string", "string", "string"] (questions to verify skills),
  "resumeScore": number (0-100, match score against job description),
  "matchingSkills": ["string", ...] (skills matching the job description),
  "skillGaps": ["string", ...] (required skills missing from resume),
  "recommendations": ["string", ...] (3-5 recommendations to improve fit)
}

Job Description:
${jobDescription}

Resume text:
${text}
`;
  }

  // Generic analysis if no job description
  return `
You are a document analysis engine. Return ONLY a valid JSON object:

{
  "summary": "string (100-200 words)",
  "keyPoints": ["string", ...] (5-7 items),
  "sentiment": { "label": "positive|negative|neutral", "score": 0.0-1.0 },
  "keywords": ["string", ...] (top 10 keywords),
  "questions": ["string", "string", "string"]
}

Document text:
${text}
`;
};

const extractJson = (text) => {
  if (!text) return null;
  const fenced = text.replace(/^```json\n?|```$/gim, "").trim();
  const firstBrace = fenced.indexOf("{");
  if (firstBrace === -1) return null;
  const candidate = fenced.slice(firstBrace);

  let depth = 0,
    endIdx = -1;
  for (let i = 0; i < candidate.length; i++) {
    const ch = candidate[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) return null;
  try {
    return JSON.parse(candidate.slice(0, endIdx + 1));
  } catch {
    return null;
  }
};

const processQueue = async () => {
  if (running) return;
  running = true;

  while (queue.length) {
    const id = queue.shift();
    try {
      const doc = await Document.findById(id).populate("user analysis");
      if (!doc) continue;

      // Create or update Analysis
      let analysisDoc;
      if (doc.analysis) {
        analysisDoc = await Analysis.findByIdAndUpdate(
          doc.analysis,
          { $set: { status: "processing" } },
          { new: true, runValidators: true }
        );
      } else {
        analysisDoc = await Analysis.create({
          document: doc._id,
          status: "processing",
        });
        doc.analysis = analysisDoc._id;
        await doc.save();
      }

      // Notify UI: started
      try {
        const io = getIO();
        if (io && doc.user?._id)
          io.to(String(doc.user._id)).emit("analysis:started", {
            docId: doc._id,
          });
      } catch {}

      // Call AI
      const user = doc.user ? await User.findById(doc.user._id) : null;
      const provider = user?.preferredAI || "openai";
      const apiKeys = user?.aiKeys || {};
      const serverKey = process.env.OPENAI_API_KEY;

      let raw = null;
      try {
        raw = await analyzeWithProvider(
          provider,
          apiKeys,
          buildPrompt(doc.text || doc.originalName, doc.jobDescription),
          serverKey
        );
      } catch (err) {
        raw = { error: err.message || String(err) };
      }

      let parsed = null;
      try {
        parsed = extractJson(raw) || JSON.parse(raw);
      } catch {
        parsed = null;
      }

      const result = {
        summary: parsed?.summary || (doc.text || "").slice(0, 300),
        keyPoints: parsed?.keyPoints || [],
        sentiment: parsed?.sentiment || { label: "neutral", score: 0.5 },
        keywords: parsed?.keywords || [],
        questions: parsed?.questions || [],
        resumeScore: parsed?.resumeScore || null,
        matchingSkills: parsed?.matchingSkills || [],
        skillGaps: parsed?.skillGaps || [],
        recommendations: parsed?.recommendations || [],
        rawResponse: raw || {},
        processedAt: new Date(),
        status: "done",
      };

      analysisDoc = await Analysis.findByIdAndUpdate(
        analysisDoc._id,
        { $set: result },
        { new: true, runValidators: true }
      );

      try {
        const io = getIO();
        if (io && doc.user?._id)
          io.to(String(doc.user._id)).emit("analysis:done", {
            docId: doc._id,
            analysis: analysisDoc,
          });
      } catch {}
    } catch (err) {
      console.error("Queue processing error:", err);
    }
  }

  running = false;
};

export const resumePendingJobs = async () => {
  if (initialized) return;
  initialized = true;

  const pending = await Analysis.find({ status: "processing" });
  for (const a of pending) enqueue(a.document.toString());
};

export default { enqueue, resumePendingJobs };
