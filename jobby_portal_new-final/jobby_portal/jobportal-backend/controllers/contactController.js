import User from "../models/User.js";
import Contact from "../models/Contact.js";
import { sendEmail } from "../services/emailService.js";

/**
 * POST /api/contact
 * Send a message to a company or general support
 */
export async function contactCompany(req, res) {
    try {
        const { companyId, name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }

        let recipientEmail = process.env.SUPPORT_EMAIL || "support@jobbe.com"; // Default support
        let companyName = "General Support";

        // If contacting a specific company
        if (companyId) {
            const company = await User.findById(companyId);
            if (!company || company.role !== "employer") {
                return res.status(404).json({ message: "Company not found" });
            }
            if (company.email) {
                recipientEmail = company.email;
            }
            companyName = company.companyName;
        }

        // Save message to database
        const contactMessage = await Contact.create({
            name,
            email,
            subject: subject || "No Subject",
            message,
            companyId: companyId || null,
            companyName,
            status: "new"
        });

        // Email content for the company
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #7c3aed; padding: 20px; color: white;">
                    <h2 style="margin: 0;">New Contact Message</h2>
                </div>
                <div style="padding: 20px;">
                    <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                    <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <div style="background-color: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
                    This message was sent via Jobbe Portal.
                </div>
            </div>
        `;

        // Send email
        await sendEmail({
            to: recipientEmail,
            subject: `[Jobbe Contact] ${subject || "New Message"}`,
            html: htmlContent,
            replyTo: email
        });

        res.json({
            message: "Message sent successfully!",
            contactId: contactMessage._id
        });

    } catch (err) {
        console.error("Contact controller error:", err);
        res.status(500).json({ message: "Failed to send message." });
    }
}

/**
 * GET /api/contact
 * Get all contact messages (admin only)
 */
export async function getAllContactMessages(req, res) {
    try {
        const messages = await Contact.find()
            .sort({ createdAt: -1 })
            .limit(100);

        res.json(messages);
    } catch (err) {
        console.error("Get contacts error:", err);
        res.status(500).json({ message: "Failed to retrieve messages." });
    }
}

/**
 * GET /api/contact/company/:id
 * Get contact messages for a specific company
 */
export async function getCompanyContactMessages(req, res) {
    try {
        const { id } = req.params;

        const messages = await Contact.find({ companyId: id })
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        console.error("Get company contacts error:", err);
        res.status(500).json({ message: "Failed to retrieve messages." });
    }
}

/**
 * PATCH /api/contact/:id/status
 * Update message status
 */
export async function updateContactStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["new", "read", "replied"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const message = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json(message);
    } catch (err) {
        console.error("Update contact status error:", err);
        res.status(500).json({ message: "Failed to update status." });
    }
}
