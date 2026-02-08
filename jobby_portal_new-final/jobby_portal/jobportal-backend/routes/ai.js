// routes/ai.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    generateResume,
    scoreResume,
    matchJobs,
    generateJobDescription,
    rankCandidates,
    chat
} from "../controllers/aiController.js";

const router = express.Router();

// All AI routes require authentication
router.use(authMiddleware);

// Resume AI endpoints
router.post("/resume/generate", generateResume);
router.post("/resume/score", scoreResume);

// Job AI endpoints
router.post("/jobs/match", matchJobs);
router.post("/job/description", generateJobDescription);

// Candidate AI endpoints (for employers)
router.post("/candidates/rank", rankCandidates);

// Chat AI endpoint
router.post("/chat", chat);

export default router;
