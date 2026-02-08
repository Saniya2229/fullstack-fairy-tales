// models/Job.js
import { Schema, model } from "mongoose";

const JobSchema = new Schema({
  employer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  description: String,
  location: String,
  salaryRange: String,
  jobType: String,
  category: { type: String, required: true, default: "Others" },
  qualifications: [String],
  responsibilities: [String],
  status: { type: String, default: "open" },
  createdAt: { type: Date, default: Date.now },
});

export default model("Job", JobSchema);
