// controllers/otpController.js
import { sendOTP, verifyOTP } from "../services/otpService.js";

/**
 * Send OTP to email
 */
export async function sendOTPController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        await sendOTP(email);

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Send OTP error:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
}

/**
 * Verify OTP
 */
export async function verifyOTPController(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const isValid = verifyOTP(email, otp);

        if (isValid) {
            res.json({ message: "OTP verified successfully", verified: true });
        } else {
            res.status(400).json({ message: "Invalid or expired OTP", verified: false });
        }
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
}
