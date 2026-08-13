import multer from "multer";
import path from "path";

const uploadDir = path.resolve("./uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  // Accept any text/* MIME types and PDFs. Some systems may send application/octet-stream for txt files,
  // so also accept by filename extension as a fallback.
  const mimetype = (file.mimetype || "").toLowerCase();
  const allowedMimes = ["application/pdf"];
  if (mimetype.startsWith("text/")) return cb(null, true);
  if (allowedMimes.includes(mimetype)) return cb(null, true);

  // fallback: allow .txt or .md extensions even if mimetype is generic
  const ext = path.extname(file.originalname || "").toLowerCase();
  if (ext === ".txt" || ext === ".md") return cb(null, true);

  cb(new Error("Invalid file type. Only PDF and TXT/MD allowed."));
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

export default upload;
