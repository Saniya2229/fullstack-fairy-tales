// routes/resumes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createResume,
  getMyResumes,
  generateResumePdf,
  deleteMyResumes,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/create", authMiddleware, createResume);
router.get("/my", authMiddleware, getMyResumes);
router.delete("/my", authMiddleware, deleteMyResumes);
router.post("/pdf", authMiddleware, generateResumePdf);

export default router;
