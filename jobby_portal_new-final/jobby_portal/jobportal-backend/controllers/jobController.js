// controllers/jobController.js
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export async function createJob(req, res) {
  try {
    const { title, description, location, salaryRange, jobType, category, qualifications, responsibilities } = req.body;
    const job = await Job.create({
      employer: req.user.id,
      title,
      description,
      location,
      salaryRange,
      jobType,
      category: category || "Others",
      qualifications,
      responsibilities,
    });
    res.json(job);
  } catch (err) {
    console.error("createJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Not found" });
    if (job.employer.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Not allowed" });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    console.error("updateJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getJob(req, res) {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "companyName companyLogo companyWebsite companyLinkedIn companyLocation companyDescription email"
    );
    if (!job) return res.status(404).json({ message: "Not found" });
    res.json(job);
  } catch (err) {
    console.error("getJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function listJobs(req, res) {
  try {
    const jobs = await Job.find().populate("employer", "companyName companyLogo companyWebsite companyLinkedIn");
    res.json(jobs);
  } catch (err) {
    console.error("listJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get counts of jobs per category
export async function getJobCategories(req, res) {
  try {
    const categories = await Job.aggregate([
      { $match: { status: "open" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Transform to friendlier format if needed
    // const formatted = categories.map(c => ({ name: c._id, count: c.count }));
    res.json(categories);
  } catch (err) {
    console.error("Category aggr error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get recent active jobs (limit 8)
export async function getLatestJobs(req, res) {
  try {
    const jobs = await Job.find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("employer", "companyName companyLogo companyWebsite companyLinkedIn");
    res.json(jobs);
  } catch (err) {
    console.error("getLatestJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get employer's own jobs with applicant counts
export async function getMyJobs(req, res) {
  try {
    const jobs = await Job.find({ employer: req.user.id }).populate(
      "employer",
      "companyName companyLogo companyWebsite companyLinkedIn email"
    );

    // Get applicant counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicantsCount: count };
      })
    );

    res.json(jobsWithCounts);
  } catch (err) {
    console.error("getMyJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function applyToJob(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if already applied
    const existing = await Application.findOne({ job: id, applicant: userId });
    if (existing) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    // Create application
    const application = await Application.create({
      job: id,
      applicant: userId,
      // resume: req.body.resumeId // Optional: if we want to link specific resume
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Not found" });
    if (job.employer.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Not allowed" });
    await job.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
