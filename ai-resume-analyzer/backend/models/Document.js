import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    filename: { type: String, required: true },
    originalName: { type: String, required: true, text: true },
    mimeType: String,
    size: Number,
    text: { type: String, text: true },
    jobDescription: { type: String, default: null, text: true },
    analysis: { type: mongoose.Schema.Types.ObjectId, ref: "Analysis" },
  },
  { timestamps: true }
);

documentSchema.index({ originalName: "text", text: "text" });
documentSchema.index({ user: 1, uploadedAt: -1 });

const Document = mongoose.model("Document", documentSchema);
export default Document;
