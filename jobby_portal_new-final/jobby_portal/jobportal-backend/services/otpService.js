// services/otpService.js
import nodemailer from "nodemailer";
import crypto from "crypto";

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Create transporter function (lazy initialization)
function getTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',  // Use Gmail service for easier setup
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

/**
 * Send OTP to email
 * @param {string} email - Recipient email
 * @returns {Promise<string>} - Generated OTP
 */
export async function sendOTP(email) {
    // Check credentials at RUNTIME (not module load time)
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const hasCredentials = Boolean(emailUser && emailPass);

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with 5-minute expiry
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(email, {
        otp,
        expiresAt,
        attempts: 0,
    });

    // ALWAYS show OTP in console for debugging/testing
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🔐 OTP GENERATED`);
    console.log(`${'='.repeat(50)}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 OTP Code: ${otp}`);
    console.log(`⏰ Expires: 5 minutes`);
    console.log(`${'='.repeat(50)}\n`);

    // Skip email sending if no credentials configured
    if (!hasCredentials) {
        console.log("⚠️ No email credentials - use the OTP shown above");
        return otp;
    }

    try {
        console.log(`📤 Attempting to send email...`);
        console.log(`   From: ${emailUser}`);
        console.log(`   To: ${email}`);

        // Send email
        const mailOptions = {
            from: `"Jobby Portal" <${emailUser}>`,
            to: email,
            subject: "Your Job Application Verification Code",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Verify Your Email</h2>
          <p>Your verification code for job application is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #7c3aed; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #6b7280;">This code will expire in 5 minutes.</p>
          <p style="color: #6b7280; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
        };

        const transporter = getTransporter();
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully!`);
        console.log(`   Message ID: ${info.messageId}`);

        return otp;
    } catch (error) {
        console.error(`\n❌ EMAIL SENDING FAILED`);
        console.error(`   Error: ${error.message}`);
        console.error(`   Code: ${error.code || 'N/A'}`);
        console.log(`\n⚠️ Use the OTP shown above in the console!`);

        // Still return the OTP (it's stored in memory)
        return otp;
    }
}



/**
 * Verify OTP
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @returns {boolean} - True if valid, false otherwise
 */
export function verifyOTP(email, otp) {
    const stored = otpStore.get(email);

    if (!stored) {
        return false; // No OTP found
    }

    // Check if expired
    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        return false;
    }

    // Check attempts (max 3)
    if (stored.attempts >= 3) {
        otpStore.delete(email);
        return false;
    }

    // Verify OTP
    if (stored.otp === otp) {
        otpStore.delete(email); // Remove after successful verification
        return true;
    }

    // Increment attempts
    stored.attempts += 1;
    return false;
}

/**
 * Clear OTP for an email
 * @param {string} email - User email
 */
export function clearOTP(email) {
    otpStore.delete(email);
}
