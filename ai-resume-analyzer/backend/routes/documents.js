import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../utils/file.js";
import {
  uploadDoc,
  listDocs,
  getDoc,
  deleteDoc,
  downloadOriginal,
  analyzeDoc,
  previewDoc,
} from "../controllers/documentsController.js";
import { limitDocumentsPerDay } from "../middleware/rateLimit.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  limitDocumentsPerDay(),
  upload.single("file"),
  uploadDoc
);
router.get("/", protect, listDocs);
router.get("/:id", protect, getDoc);
router.get("/:id/download", protect, downloadOriginal);
router.get("/:id/preview", protect, previewDoc);
router.post("/:id/analyze", protect, analyzeDoc);
router.delete("/:id", protect, deleteDoc);

export default router;
