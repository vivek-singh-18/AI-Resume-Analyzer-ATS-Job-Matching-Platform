import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";
import Document from "../models/Document.js";
import { enqueue } from "../jobs/worker.js";
import Analysis from "../models/Analysis.js";

const uploadsDir = path.resolve("./uploads");

const extractText = async (filePath, mimeType) => {
  const data = await fs.readFile(filePath);
  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data });
    const textResult = await parser.getText();
    return textResult.text;
  }
  return data.toString("utf8");
};

// Upload document
export const uploadDoc = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File required" });
    const { filename, originalname, mimetype, size, path: filePath } = req.file;
    const { jobDescription } = req.body;
    const text = await extractText(filePath, mimetype);

    // Create document
    const doc = await Document.create({
      user: req.user._id,
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      text,
      jobDescription: jobDescription || null,
    });
    res.json({ doc });
  } catch (err) {
    next(err);
  }
};

// List documents with pagination
export const listDocs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    if (req.query.q) query.$text = { $search: req.query.q };
    const [docs, total] = await Promise.all([
      Document.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "originalName mimeType size createdAt updatedAt jobDescription analysis _id"
        )
        .populate({
          path: "analysis",
          select:
            "status summary keyPoints sentiment keywords questions resumeScore matchingSkills skillGaps recommendations processedAt",
        }),
      Document.countDocuments({ user: req.user._id }),
    ]);

    res.json({ docs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// Get single document
export const getDoc = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (!doc.user.equals(req.user._id))
      return res.status(403).json({ error: "Forbidden" });
    res.json({ doc });
  } catch (err) {
    next(err);
  }
};

export const deleteDoc = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (!doc.user.equals(req.user._id))
      return res.status(403).json({ error: "Forbidden" });

    // Remove file from disk
    const filePath = path.join(uploadsDir, doc.filename);
    const resolved = path.resolve(filePath);
    if (resolved.startsWith(uploadsDir)) {
      await fs.unlink(resolved).catch(() => {});
    }

    if (doc.analysis) {
      await Analysis.findByIdAndDelete(doc.analysis);
    }

    await doc.deleteOne();

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// Preview document (text or PDF)
export const previewDoc = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).populate("analysis");
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (!doc.user.equals(req.user._id))
      return res.status(403).json({ error: "Forbidden" });

    // Prepare response data
    const responseData = {
      _id: doc._id,
      filename: doc.filename,
      originalName: doc.originalName,
      mimeType: doc.mimeType,
      size: doc.size,
      text: doc.text || "",
      jobDescription: doc.jobDescription || null,
      uploadedAt: doc.createdAt,
      analysis: doc.analysis
        ? {
            status: doc.analysis.status,
            summary: doc.analysis.summary,
            keyPoints: doc.analysis.keyPoints,
            sentiment: doc.analysis.sentiment,
            keywords: doc.analysis.keywords,
            questions: doc.analysis.questions,
            resumeScore: doc.analysis.resumeScore,
            matchingSkills: doc.analysis.matchingSkills,
            skillGaps: doc.analysis.skillGaps,
            recommendations: doc.analysis.recommendations,
            processedAt: doc.analysis.processedAt,
          }
        : null,
    };

    return res.json(responseData);
  } catch (err) {
    next(err);
  }
};

// Download original document
export const downloadOriginal = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (!doc.user.equals(req.user._id))
      return res.status(403).json({ error: "Forbidden" });

    const filePath = path.join(uploadsDir, doc.filename);
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(uploadsDir))
      return res.status(400).json({ error: "Invalid file path" });

    res.download(resolved, doc.originalName);
  } catch (err) {
    next(err);
  }
};

// Analyze document
export const analyzeDoc = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).populate("analysis");
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (!doc.user.equals(req.user._id))
      return res.status(403).json({ error: "Forbidden" });

    if (doc.analysis?.status === "done") {
      return res.json({ ok: true, cached: true, analysis: doc.analysis });
    }
    if (doc.analysis?.status === "processing") {
      return res.json({ ok: true, message: "Process Already Started" });
    }

    const analysis = await Analysis.create({
      document: doc._id,
      status: "processing",
    });
    doc.analysis = analysis._id;
    await doc.save();

    await enqueue(doc._id);

    res.json({ ok: true, message: "Analysis started", analysis });
  } catch (err) {
    next(err);
  }
};

export default {
  uploadDoc,
  listDocs,
  getDoc,
  deleteDoc,
  previewDoc,
  analyzeDoc,
  downloadOriginal,
};
