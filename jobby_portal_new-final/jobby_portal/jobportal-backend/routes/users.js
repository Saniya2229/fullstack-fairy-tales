// routes/users.js
import { Router } from "express";
const router = Router();

import authMiddleware from "../middleware/authMiddleware.js";

import {
  me,
  update,
  submitFullProfile,
  getDashboardInfo,
  getEmployers,
  getEmployerById,
  toggleSavedJob,
  getSavedJobs
} from "../controllers/userController.js";

router.get("/me", authMiddleware, me);
router.put("/me", authMiddleware, update);
router.post("/profile/submit", authMiddleware, submitFullProfile);
router.get("/dashboard", authMiddleware, getDashboardInfo);

// Saved Jobs
router.post("/saved-jobs/:id", authMiddleware, toggleSavedJob);
router.get("/saved-jobs", authMiddleware, getSavedJobs);

// Public routes for companies
router.get("/employers", getEmployers);
router.get("/employers/:id", getEmployerById);

export default router;
