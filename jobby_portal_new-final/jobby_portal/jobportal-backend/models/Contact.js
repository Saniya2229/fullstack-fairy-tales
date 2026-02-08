import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null, // null means general support inquiry
        },
        status: {
            type: String,
            enum: ["new", "read", "replied"],
            default: "new",
        },
        // Store company name for easier querying
        companyName: {
            type: String,
            default: "General Support",
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Index for efficient querying
contactSchema.index({ companyId: 1, status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
