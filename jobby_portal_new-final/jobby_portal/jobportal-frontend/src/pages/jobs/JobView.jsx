// src/pages/jobs/JobView.jsx
import React, { useEffect, useState } from "react";
import { getJob, listJobs } from "../../api/jobs";
import { createApplication, getMyApplications } from "../../api/applications";
import { getSavedJobs, toggleSavedJob } from "../../api/user";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiMapPin, FiDollarSign, FiClock, FiBriefcase, FiCheckCircle,
  FiShare2, FiArrowLeft, FiGlobe, FiCalendar, FiUser, FiCheck,
  FiFacebook, FiLinkedin, FiTwitter, FiAward, FiLayers,
  FiHeart
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import QuickApplyModal from "../../components/QuickApplyModal";
import Navbar from "../../components/Navbar";

export default function JobView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showQuickApply, setShowQuickApply] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Get current user
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getJob(id);
        setJob(res.data);

        // Fetch related jobs (mock logic: just fetch all and take first 3)
        const allJobs = await listJobs();
        setRelatedJobs(allJobs.data.filter(j => j._id !== id).slice(0, 3));

        // Check if user has already applied (only for job seekers)
        if (user && user.role === "seeker") {
          try {
            const myApps = await getMyApplications();
            const existingApp = myApps.find(app => app.job?._id === id);
            if (existingApp) {
              setHasApplied(true);
              setApplicationStatus(existingApp.status);
            }

            // Check if saved
            const savedJobs = await getSavedJobs();
            if (savedJobs.some(j => j._id === id)) {
              setIsSaved(true);
            }
          } catch (err) {
            console.error("Error checking applications/saved:", err);
          }
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApply = () => {
    // Check if user is logged in before allowing apply
    if (!user) {
      // Store the current job URL for redirect after login
      sessionStorage.setItem('redirectAfterLogin', `/jobs/${id}`);
      nav('/auth/login/jobseeker');
      return;
    }
    setShowQuickApply(true);
  };

  const handleApplicationSuccess = async () => {
    try {
      const myApps = await getMyApplications();
      const existingApp = myApps.find(app => app.job?._id === id);
      if (existingApp) {
        setHasApplied(true);
        setApplicationStatus(existingApp.status);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error refreshing applications:", err);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      nav('/auth/login/jobseeker');
      return;
    }
    try {
      const res = await toggleSavedJob(id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error("Error toggling saved job:", err);
    }
  };

  // Helper render button (kept roughly same logic but updated classes)
  const renderApplyButton = (className = "") => {
    if (hasApplied) {
      const statusConfig = {
        applied: { color: "bg-blue-500", text: "Applied" },
        reviewed: { color: "bg-purple-500", text: "Reviewed" },
        interview: { color: "bg-orange-500", text: "Interviewing" },
        rejected: { color: "bg-red-500", text: "Rejected" },
        hired: { color: "bg-green-500", text: "Hired" }
      };
      const config = statusConfig[applicationStatus] || statusConfig.applied;

      return (
        <button disabled className={`w-full py-4 ${config.color} text-white font-bold rounded-2xl cursor-not-allowed opacity-90 flex items-center justify-center gap-2 shadow-lg`}>
          <FiCheck /> {config.text}
        </button>
      );
    }

    return (
      <button
        onClick={handleApply}
        disabled={applying}
        className="btn-primary w-full py-4 text-lg shadow-primary-500/40"
      >
        {applying ? "Applying..." : "Apply Now"}
      </button>
    );
  };

  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this ${job.title} job at ${job.employer?.companyName}`;
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader /></div>;

  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
      <button onClick={() => nav('/jobs')} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">&larr; Back to Jobs</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Success/Error Toasts */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-24 right-6 z-50 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-3">
            <FiCheckCircle className="text-xl" /> <span className="font-semibold">Application submitted!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-28 pb-20 container-custom">
        {/* Back Button */}
        <button onClick={() => nav(-1)} className="text-slate-500 hover:text-primary-600 flex items-center gap-2 mb-8 transition-colors font-medium hover:-translate-x-1 duration-300">
          <FiArrowLeft /> Back to Listings
        </button>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Main Content (Left) */}
          <div className="lg:col-span-2">

            {/* Header Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-full -z-0 opacity-50" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-6">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 inline-block">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-3xl text-primary-600 font-bold">
                      {job.employer?.companyName?.charAt(0) || "C"}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleToggleSave} className={`p-3 rounded-xl border transition-all ${isSaved ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500'}`}>
                      <FiHeart className={isSaved ? "fill-red-500" : ""} />
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-white bg-white transition-all"><FiShare2 /></button>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{job.title}</h1>

                <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
                  <span className="flex items-center gap-2"><FiBriefcase className="text-primary-500" /> {job.employer?.companyName}</span>
                  <span className="flex items-center gap-2"><FiMapPin className="text-primary-500" /> {job.location}</span>
                  <span className="flex items-center gap-2"><FiClock className="text-primary-500" /> Posted 2 days ago</span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Job Description</h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                {job.description}
              </div>
            </motion.div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Responsibilities</h2>
                <ul className="space-y-4">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-600">
                      <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5 text-sm">
                        <FiCheck />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">

            {/* Quick Apply Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-3xl shadow-card border border-primary-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-indigo-500" />
              <h3 className="text-xl font-bold text-slate-900 mb-6">Interested in this job?</h3>
              <div className="space-y-6">
                {/* Metadata List */}
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <span className="text-slate-500">Salary</span>
                  <span className="font-bold text-slate-900">{job.salaryRange}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <span className="text-slate-500">Experience</span>
                  <span className="font-bold text-slate-900">1-3 Years</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <span className="text-slate-500">Type</span>
                  <span className="font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">{job.jobType}</span>
                </div>

                <div className="pt-4">
                  {renderApplyButton()}
                </div>
              </div>
            </motion.div>

            {/* Company Info */}
            <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl text-slate-400 font-bold">
                  {job.employer?.companyName?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{job.employer?.companyName}</h3>
                  {job.employer?.companyWebsite ? (
                    <a href={job.employer.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm hover:underline">View Website</a>
                  ) : (
                    <span className="text-slate-400 text-sm">No website available</span>
                  )}
                </div>
              </div>
              <hr className="border-slate-50 mb-6" />
              <div className="space-y-4">
                <div className="flex gap-4">
                  <FiMapPin className="text-slate-400 mt-1" />
                  <span className="text-slate-600 text-sm">{job.location}</span>
                </div>
                <div className="flex gap-4">
                  <FiGlobe className="text-slate-400 mt-1" />
                  {job.employer?.companyWebsite ? (
                    <a href={job.employer.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm break-all hover:underline">{job.employer.companyWebsite}</a>
                  ) : (
                    <span className="text-slate-400 text-sm italic">Website not provided</span>
                  )}
                </div>
              </div>
              <Link to={`/companies/${job.employer?._id}`} className="btn-secondary w-full mt-6 py-3 text-sm block text-center">
                View Company Profile
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* Quick Apply Modal */}
      <AnimatePresence>
        {showQuickApply && (
          <QuickApplyModal
            isOpen={showQuickApply}
            onClose={() => setShowQuickApply(false)}
            job={job}
            user={user}
            onSuccess={handleApplicationSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
