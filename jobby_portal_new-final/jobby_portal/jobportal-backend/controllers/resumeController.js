// controllers/resumeController.js
import Resume from "../models/Resume.js";
import { generatePdfFromHtml } from "../utils/pdfGenerator.js";
import { join } from "path";

/**
 * GET /api/resumes/my
 * Fetch all resumes for logged-in user
 */
export async function getMyResumes(req, res) {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(resumes);
  } catch (err) {
    console.error("getMyResumes error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/resumes/create
 * Create a resume (template + data)
 */
export async function createResume(req, res) {
  try {
    const { template, headline, summary, skills, experience, education, pdfUrl } = req.body;

    const resume = await Resume.create({
      user: req.user._id,
      template,
      headline,
      summary,
      skills,
      experience,
      education,
      pdfUrl
    });

    res.json(resume);
  } catch (err) {
    console.error("createResume error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/resumes/:id
 * Fetch single resume
 */
export async function getResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Not found" });

    res.json(resume);
  } catch (err) {
    console.error("getResume error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/resumes/pdf
 * Generate PDF from HTML string
 */
export async function generateResumePdf(req, res) {
  try {
    const { html } = req.body;

    if (!html) return res.status(400).json({ message: "HTML required" });

    const pdf = await generatePdfFromHtml(
      html,
      process.env.UPLOAD_DIR || "./uploads"
    );

    const url = `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${pdf.filename
      }`;

    res.json({ pdfUrl: url });
  } catch (err) {
    console.error("generateResumePdf error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/resumes/:id/download
 * Download generated PDF
 */
export async function downloadResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || !resume.pdfUrl)
      return res.status(404).json({ message: "PDF not found" });

    const filename = resume.pdfUrl.split("/").pop();
    const filepath = join(process.env.UPLOAD_DIR || "./uploads", filename);

    res.download(filepath);
  } catch (err) {
    console.error("downloadResume error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * DELETE /api/resumes/my
 * Delete all resumes for logged-in user
 */
export async function deleteMyResumes(req, res) {
  try {
    const userId = req.user.id || req.user._id;
    await Resume.deleteMany({ user: userId });
    res.json({ message: "Resumes deleted successfully" });
  } catch (err) {
    console.error("deleteMyResumes error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
