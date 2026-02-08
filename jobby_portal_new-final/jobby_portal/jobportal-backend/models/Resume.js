import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    template: { type: String, required: true },
    headline: String,
    summary: String,
    skills: [String],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        college: String,
        year: String,
      },
    ],
    pdfUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
