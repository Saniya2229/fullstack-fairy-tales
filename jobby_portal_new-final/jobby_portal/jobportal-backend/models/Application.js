// models/Application.js
import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema({
    job: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resume: {
        type: Schema.Types.ObjectId,
        ref: "Resume",
    },
    status: {
        type: String,
        enum: ["applied", "reviewed", "interview", "rejected", "hired"],
        default: "applied",
    },
    notes: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent duplicate applications
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default model("Application", ApplicationSchema);
