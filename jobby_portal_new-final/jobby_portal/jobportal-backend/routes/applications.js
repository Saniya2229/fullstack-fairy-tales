// routes/applications.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getEmployerApplications,
    updateApplication,
    getMyApplications,
    createApplication,
    cancelApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

// Create a new application (job seeker applies for a job)
router.post("/", authMiddleware, createApplication);

// Get all applications for the logged-in employer
router.get("/", authMiddleware, getEmployerApplications);

// Get applications for the logged-in job seeker
router.get("/my", authMiddleware, getMyApplications);

// Update specific application
router.put("/:id", authMiddleware, updateApplication);

// Cancel/delete application (job seeker withdraws)
router.delete("/:id", authMiddleware, cancelApplication);

export default router;
