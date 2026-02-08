// controllers/applicationController.js
import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Get all applications for employer's jobs
export async function getEmployerApplications(req, res) {
    try {
        console.log("=== getEmployerApplications called ===");
        console.log("User ID:", req.user?.id);
        console.log("User role:", req.user?.role);

        // 1. Find all jobs posted by this employer
        const jobs = await Job.find({ employer: req.user.id }).select("_id title");
        console.log("Jobs found for employer:", jobs.length);
        console.log("Job IDs:", jobs.map(j => ({ id: j._id, title: j.title })));

        const jobIds = jobs.map((j) => j._id);

        // 2. Find applications for these jobs
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate("job", "title")
            .populate("applicant", "firstName lastName email profilePicture")
            .sort({ appliedAt: -1 });

        console.log("Applications found:", applications.length);

        res.json(applications);
    } catch (err) {
        console.error("Get applications error:", err);
        res.status(500).json({ message: "Server error" });
    }
}


// Update application status/notes/rating
export async function updateApplication(req, res) {
    try {
        const { id } = req.params;
        const { status, notes, rating } = req.body;

        // Verify ownership (optional but recommended: check if job belongs to employer)
        // For speed, we'll assume authMiddleware protects the route, 
        // but in production, we should verify the employer owns the job.

        const application = await Application.findByIdAndUpdate(
            id,
            { $set: { status, notes, rating } },
            { new: true }
        );

        if (!application) return res.status(404).json({ message: "Not found" });

        res.json(application);
    } catch (err) {
        console.error("Update application error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Get applications for the logged-in job seeker
export async function getMyApplications(req, res) {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate({
                path: "job",
                select: "title company location status employer",
                populate: {
                    path: "employer",
                    select: "companyName companyLogo"
                }
            })
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (err) {
        console.error("Get my applications error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Create a new application
export async function createApplication(req, res) {
    try {
        const { jobId } = req.body;
        const applicantId = req.user.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if user already applied (will be caught by unique index, but we can check explicitly)
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: applicantId
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // Create new application
        const application = new Application({
            job: jobId,
            applicant: applicantId,
            status: "applied",
        });

        await application.save();

        // Populate job and applicant details before returning
        await application.populate("job", "title company location");
        await application.populate("applicant", "firstName lastName email");

        res.status(201).json(application);
    } catch (err) {
        console.error("Create application error:", err);

        // Handle duplicate key error from unique index
        if (err.code === 11000) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        res.status(500).json({ message: "Server error" });
    }
}

// Cancel/delete an application (for job seekers)
export async function cancelApplication(req, res) {
    try {
        const { id } = req.params;
        const applicantId = req.user.id;

        console.log('Cancel request - Application ID:', id);
        console.log('Cancel request - User ID:', applicantId);

        // Find the application
        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        console.log('Application applicant:', application.applicant);
        console.log('Comparison:', application.applicant.toString(), 'vs', applicantId.toString());

        // Verify the applicant owns this application (convert both to string for comparison)
        if (application.applicant.toString() !== applicantId.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this application" });
        }

        // Only allow canceling applications that are still in 'applied' status
        if (application.status !== 'applied') {
            return res.status(400).json({ message: "Cannot cancel application that has already been processed" });
        }

        // Delete the application
        await Application.findByIdAndDelete(id);

        res.json({ message: "Application cancelled successfully" });
    } catch (err) {
        console.error("Cancel application error:", err);
        res.status(500).json({ message: "Server error" });
    }
}
