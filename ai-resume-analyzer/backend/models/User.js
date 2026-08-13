import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  aiKeys: {
    openai: { type: String },
    anthropic: { type: String },
    gemini: { type: String },
  },
  preferredAI: {
    type: String,
    enum: ["openai", "anthropic", "gemini"],
    default: "openai",
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
