// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJobCategories, getLatestJobs } from "../api/jobs";
import { getSavedJobs, toggleSavedJob } from "../api/user";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";

// Components
import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import RecentJobsSection from "../components/home/RecentJobsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [categoryStats, setCategoryStats] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("Recent Jobs");
  const [savedJobIds, setSavedJobIds] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Filter Jobs Logic
  const filteredJobs = latestJobs.filter(job => {
    if (activeTab === "Recent Jobs") return true;
    if (activeTab === "Featured Jobs") return job.jobType === "Full-time"; // Mock logic
    if (activeTab === "Freelancer") return job.jobType === "Freelance";
    if (activeTab === "Part Time") return job.jobType === "Part-time";
    if (activeTab === "Full Time") return job.jobType === "Full-time";
    return true;
  });

  useEffect(() => {
    // Fetch Categories
    getJobCategories().then(data => {
      // Ensure we have data, otherwise fallback or keep empty states
      if (data && data.length > 0) {
        setCategoryStats(data);
      }
    }).catch(err => console.error("Failed to load categories", err));

    // Fetch Latest Jobs
    getLatestJobs().then(data => {
      setLatestJobs(data);
    }).catch(err => console.error("Failed to load latest jobs", err));

    // Fetch Saved Jobs (if user is logged in)
    if (user && user.role === 'seeker') {
      getSavedJobs().then(jobs => {
        setSavedJobIds(jobs.map(j => j._id));
      }).catch(err => console.error("Failed to load saved jobs", err));
    }
  }, []);

  const handleToggleSave = async (e, jobId) => {
    e.preventDefault(); // Prevent navigating to job details
    e.stopPropagation();

    if (!user) {
      navigate('/auth/login/jobseeker');
      return;
    }

    try {
      const res = await toggleSavedJob(jobId);
      if (res.saved) {
        setSavedJobIds(prev => [...prev, jobId]);
      } else {
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      }
    } catch (err) {
      console.error("Error toggling saved job:", err);
    }
  };

  const handleSearch = () => {
    // Always navigate to jobs page, with or without filters
    let query = `/jobs`;
    const params = [];

    if (keyword.trim()) params.push(`keyword=${encodeURIComponent(keyword.trim())}`);
    if (location.trim()) params.push(`location=${encodeURIComponent(location.trim())}`);
    if (category.trim()) params.push(`category=${encodeURIComponent(category.trim())}`);

    if (params.length > 0) {
      query += `?${params.join('&')}`;
    }

    navigate(query);
  };

  const DEFAULT_CATEGORIES = ['Design', 'Development', 'Marketing', 'Finance', 'Healthcare', 'Sales', 'Engineering', 'HR'];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <PageTransition>
        <HeroSection
          keyword={keyword}
          setKeyword={setKeyword}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          handleSearch={handleSearch}
        />

        <CategorySection
          categoryStats={categoryStats}
          DEFAULT_CATEGORIES={DEFAULT_CATEGORIES}
        />

        <RecentJobsSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredJobs={filteredJobs}
          savedJobIds={savedJobIds}
          handleToggleSave={handleToggleSave}
        />

        <HowItWorksSection />

        {/* Professional Footer */}
        <Footer />
      </PageTransition>
    </div>
  );
};

export default LandingPage;
