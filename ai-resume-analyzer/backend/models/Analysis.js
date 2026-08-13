import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    status: { type: String, default: "pending" },
    summary: String,
    keyPoints: [String],
    sentiment: { label: String, score: Number },
    keywords: [String],
    questions: [String],
    resumeScore: { type: Number, min: 0, max: 100 },
    matchingSkills: [String],
    skillGaps: [String],
    recommendations: [String],
    rawResponse: mongoose.Schema.Types.Mixed,
    processedAt: Date,
  },
  { timestamps: true }
);

// Define all indexes here (preferred)
analysisSchema.index({ document: 1 });
analysisSchema.index({ status: 1 });
analysisSchema.index({ processedAt: -1 });

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;
