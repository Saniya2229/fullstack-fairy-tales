// src/api/otp.js
import api from "./api";

/**
 * Send OTP to email
 * @param {string} email - Email address
 */
export async function sendOTP(email) {
    const res = await api.post("/otp/send", { email });
    return res.data;
}

/**
 * Verify OTP
 * @param {string} email - Email address
 * @param {string} otp - OTP code
 */
export async function verifyOTP(email, otp) {
    const res = await api.post("/otp/verify", { email, otp });
    return res.data;
}
