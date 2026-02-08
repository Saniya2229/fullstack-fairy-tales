// controllers/userController.js
import User from "../models/User.js";

/**
 * GET /api/users/me
 * Return logged-in user info
 */
export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * PUT /api/users/me
 * Update partial profile fields (flat object)
 */
export async function update(req, res) {
  try {
    const userId = req.user.id;
    const payload = req.body; // flat structure

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: payload },
      { new: true }
    ).lean();

    res.json(updated);
  } catch (err) {
    console.error("update error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/users/profile/submit
 * Final profile submit (after finishing ProfileSteps)
 */
export async function submitFullProfile(req, res) {
  try {
    const userId = req.user.id;

    // Remove email from the payload to avoid duplicate key error
    // Email should not be changed during profile update
    const { email, ...profileData } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...profileData, // full draft without email
          profileCompleted: true,
        },
      },
      { new: true }
    ).lean();

    res.json({
      message: "Profile submitted successfully",
      user: updated,
    });
  } catch (err) {
    console.error("submit profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


export async function getDashboardInfo(req, res) {
  try {
    res.json({
      name: req.user.firstName,
      profileCompletion: req.user.profileCompletion || 0,
      education: req.user.currentEducation_degree || "",
      internships: req.user.internships?.length || 0,
      documents: req.user.documents?.length || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/users/employers
 * Fetch all employers (public info)
 */
export async function getEmployers(req, res) {
  try {
    const employers = await User.find({ role: "employer" })
      .select("firstName lastName companyName companyLogo companyDescription companyLocation companyWebsite companySize companyEstablishedDate")
      .lean();

    // In a real app, we might want to aggregate job counts here
    // For now, we'll just return the employer profiles
    res.json(employers);
  } catch (err) {
    console.error("getEmployers error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/users/employers/:id
 * Fetch single employer by ID (public info)
 */
export async function getEmployerById(req, res) {
  try {
    console.log("Fetching employer with ID:", req.params.id);
    const employer = await User.findById(req.params.id)
      .select("firstName lastName companyName companyLogo companyDescription companyLocation companyWebsite companySize companyEstablishedDate role")
      .lean();

    console.log("Found employer:", employer);

    if (!employer || employer.role !== "employer") {
      console.log("Employer not found or role mismatch");
      return res.status(404).json({ message: "Employer not found" });
    }

    res.json(employer);
  } catch (err) {
    console.error("getEmployerById error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/users/saved-jobs/:id
 * Toggle save/unsave a job
 */
export async function toggleSavedJob(req, res) {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.savedJobs.indexOf(jobId);
    if (index === -1) {
      // Add to saved
      user.savedJobs.push(jobId);
      await user.save();
      res.json({ message: "Job saved", saved: true });
    } else {
      // Remove from saved
      user.savedJobs.splice(index, 1);
      await user.save();
      res.json({ message: "Job removed from saved", saved: false });
    }
  } catch (err) {
    console.error("toggleSavedJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/users/saved-jobs
 * Get user's saved jobs
 */
export async function getSavedJobs(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: "savedJobs",
      populate: { path: "employer", select: "companyName companyLogo" }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedJobs);
  } catch (err) {
    console.error("getSavedJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
