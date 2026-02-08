// routes/auth.js
import express from "express";
import { register, login, me } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// GET CURRENT USER
router.get("/me", authMiddleware, me);

export default router;
