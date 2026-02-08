// routes/otp.js
import express from "express";
import { sendOTPController, verifyOTPController } from "../controllers/otpController.js";

const router = express.Router();

// Send OTP to email
router.post("/send", sendOTPController);

// Verify OTP
router.post("/verify", verifyOTPController);

export default router;
