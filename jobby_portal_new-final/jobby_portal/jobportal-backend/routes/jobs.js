// routes/jobs.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createJob,
  listJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
  applyToJob,
  getJobCategories,
  getLatestJobs,
} from "../controllers/jobController.js";

const router = express.Router();

// IMPORTANT: Specific routes MUST come BEFORE parameterized routes (:id)

// Get employer's own jobs - MUST be before /:id
router.get("/my-jobs", authMiddleware, getMyJobs);

// Get job categories stats - MUST by before /:id
router.get("/categories", getJobCategories);

// Get latest jobs - MUST be before /:id
router.get("/latest", getLatestJobs);

// Create job
router.post("/", authMiddleware, createJob);

// Get all jobs (with filters)
router.get("/", listJobs);

// Apply to job
router.post("/:id/apply", authMiddleware, applyToJob);

// Get single job - MUST be after specific routes
router.get("/:id", getJob);

// Update job
router.put("/:id", authMiddleware, updateJob);

// Delete job
router.delete("/:id", authMiddleware, deleteJob);

export default router;
