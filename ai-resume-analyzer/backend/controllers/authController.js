import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Document from "../models/Document.js";

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hash });
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token: genToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });
    res.json({
      user: { name: user.name, email: user.email },
      token: genToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

export const profile = async (req, res, next) => {
  try {
    const user = req.user;
    // return paginated document history for the user
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "5", 10);
    const skip = (page - 1) * limit;
    const docs = await Document.find({ user: user._id })
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("originalName mimeType size uploadedAt analysis");
    const total = await Document.countDocuments({ user: user._id });
    const documentHistory = {
      docs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };

    res.json({ user, documentHistory });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { aiKeys, preferredAI, name } = req.body;
    if (name) user.name = name;
    if (aiKeys) user.aiKeys = { ...user.aiKeys, ...aiKeys };
    if (preferredAI) user.preferredAI = preferredAI;
    await user.save();
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredAI: user.preferredAI,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { register, login, profile };
