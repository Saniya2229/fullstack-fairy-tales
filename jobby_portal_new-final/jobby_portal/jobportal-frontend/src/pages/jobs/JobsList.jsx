import React, { useEffect, useState } from "react";
import { listJobs } from "../../api/jobs";
import { getMyApplications } from "../../api/applications";
import { getSavedJobs, toggleSavedJob } from "../../api/user";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiSearch, FiMapPin, FiBriefcase, FiClock, FiArrowLeft,
  FiFilter, FiDollarSign, FiHeart, FiChevronDown, FiChevronUp, FiCheck
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SkeletonJobCard from "../../components/SkeletonJobCard";
import PageTransition from "../../components/PageTransition";

export default function JobsList() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");
  const [locationSearch, setLocationSearch] = useState(searchParams.get("location") || "");
  const [categorySearch, setCategorySearch] = useState(searchParams.get("category") || "");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedDate, setSelectedDate] = useState("any");

  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState(new Set());
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await listJobs();
      setJobs(res.data);
      setFilteredJobs(res.data);

      if (user && user.role === "seeker") {
        try {
          const myApps = await getMyApplications();
          const appliedJobIds = new Set(myApps.map(app => app.job?._id));
          setAppliedJobs(appliedJobIds);

          const mySaved = await getSavedJobs();
          const savedJobIds = new Set(mySaved.map(job => job._id));
          setSavedJobs(savedJobIds);
        } catch (err) {
          console.error("Error fetching applications/saved:", err);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = jobs;

    // Enhanced search - searches across multiple fields with flexible matching
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(job => {
        // Search in title
        if (job.title?.toLowerCase().includes(searchLower)) return true;
        // Search in company name
        if (job.employer?.companyName?.toLowerCase().includes(searchLower)) return true;
        // Search in description
        if (job.description?.toLowerCase().includes(searchLower)) return true;
        // Search in qualifications array
        if (job.qualifications?.some(q => q.toLowerCase().includes(searchLower))) return true;
        // Search in responsibilities array
        if (job.responsibilities?.some(r => r.toLowerCase().includes(searchLower))) return true;
        // Search in category
        if (job.category?.toLowerCase().includes(searchLower)) return true;
        return false;
      });
    }

    if (locationSearch) {
      const locationLower = locationSearch.toLowerCase().trim();
      result = result.filter(job =>
        job.location?.toLowerCase().includes(locationLower) ||
        // Also match "remote" anywhere
        (locationLower.includes('remote') && job.location?.toLowerCase().includes('remote'))
      );
    }

    if (categorySearch) {
      const categoryLower = categorySearch.toLowerCase().trim();
      result = result.filter(job =>
        // Exact category match
        job.category?.toLowerCase() === categoryLower ||
        // Partial category match (e.g., "Dev" matches "Development")
        job.category?.toLowerCase().includes(categoryLower) ||
        categoryLower.includes(job.category?.toLowerCase() || '') ||
        // Also check if job title relates to the category
        job.title?.toLowerCase().includes(categoryLower)
      );
    }

    if (selectedJobTypes.length > 0) {
      result = result.filter(job => selectedJobTypes.includes(job.jobType));
    }

    if (selectedDate !== "any") {
      const now = new Date();
      result = result.filter(job => {
        const jobDate = new Date(job.createdAt);
        const diffTime = Math.abs(now - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (selectedDate === "today") return diffDays <= 1;
        if (selectedDate === "week") return diffDays <= 7;
        if (selectedDate === "month") return diffDays <= 30;
        return true;
      });
    }

    console.log(`Search: "${searchTerm}", Location: "${locationSearch}", Category: "${categorySearch}" → ${result.length} jobs found`);
    setFilteredJobs(result);
  }, [searchTerm, locationSearch, categorySearch, selectedJobTypes, selectedDate, jobs]);

  const toggleFilter = (state, setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]);
  };

  const handleToggleSave = async (e, jobId) => {
    if (!user) {
      navigate('/auth/login/jobseeker');
      return;
    }

    try {
      const res = await toggleSavedJob(jobId);
      setSavedJobs(prev => {
        const next = new Set(prev);
        if (res.saved) next.add(jobId);
        else next.delete(jobId);
        return next;
      });
    } catch (err) {
      console.error("Error toggling saved job:", err);
    }
  };



  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <PageTransition>
        <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">

            {/* Top Search Section - STICKY & GLASSMORPHIC */}
            <div className="sticky top-24 z-30 mb-8 transition-all duration-300">
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-glass border border-white/20">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/50 rounded-xl border border-transparent focus-within:border-primary-300 focus-within:bg-white transition-all shadow-inner shadow-slate-200/50">
                    <FiBriefcase className="text-primary-500 text-lg" />
                    <input
                      type="text"
                      placeholder="Job, company, title..."
                      className="bg-transparent w-full outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/50 rounded-xl border border-transparent focus-within:border-primary-300 focus-within:bg-white transition-all shadow-inner shadow-slate-200/50">
                    <FiMapPin className="text-primary-500 text-lg" />
                    <input
                      type="text"
                      placeholder="City, Zip, or Remote"
                      className="bg-transparent w-full outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/50 rounded-xl border border-transparent focus-within:border-primary-300 focus-within:bg-white transition-all shadow-inner shadow-slate-200/50">
                    <FiFilter className="text-primary-500 text-lg" />
                    <select
                      className="bg-transparent w-full outline-none text-slate-700 cursor-pointer font-medium"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Sales">Sales</option>
                      <option value="Engineering">Engineering</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      // Scroll to results section smoothly
                      const resultsSection = document.getElementById('job-results');
                      if (resultsSection) {
                        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="px-8 py-3 btn-primary shadow-lg shadow-primary-500/30"
                  >
                    Find Job
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            < div className="mb-8 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide" >
              <span className="font-bold text-slate-700 whitespace-nowrap">Popular:</span>
              {
                ['UI/UX Designer', 'Frontend Dev', 'Backend Dev', 'Product Manager', 'Sales'].map(tag => (
                  <button key={tag} onClick={() => setSearchTerm(tag)} className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors whitespace-nowrap">
                    {tag}
                  </button>
                ))
              }
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Job List (Left Column) */}
              <div id="job-results" className="lg:col-span-3 space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Jobs</h2>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    // Show 6 Skeletons while loading
                    Array.from({ length: 6 }).map((_, i) => <SkeletonJobCard key={i} />)
                  ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job, index) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        index={index}
                        hasApplied={appliedJobs.has(job._id)}
                        isSaved={savedJobs.has(job._id)}
                        onToggleSave={handleToggleSave}
                      />
                    ))
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-3xl">
                        <FiSearch />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
                      <p className="text-slate-500">Try adjusting your search filters.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar Filters (Right Column) */}
              <div className="lg:col-span-1 space-y-6">

                {/* Location Filter */}
                <FilterSection title="Location" isOpen={true}>
                  <div className="relative mb-4">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Area Range: 9.00 miles</div>
                  <input type="range" className="w-full accent-purple-600" />
                </FilterSection>

                {/* Work Experience */}
                <FilterSection title="Work experience" isOpen={true}>
                  <div className="space-y-2">
                    {["No experience", "0-3 years", "3-6 years", "More than 6 years"].map(exp => (
                      <CheckboxItem
                        key={exp}
                        label={exp}
                        checked={selectedExperience.includes(exp)}
                        onChange={() => toggleFilter(selectedExperience, setSelectedExperience, exp)}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Type of Employment */}
                <FilterSection title="Type of employment" isOpen={true}>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Freelance", "Internship"].map(type => (
                      <CheckboxItem
                        key={type}
                        label={type}
                        checked={selectedJobTypes.includes(type)}
                        onChange={() => toggleFilter(selectedJobTypes, setSelectedJobTypes, type)}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Date Posted */}
                <FilterSection title="Date Posted" isOpen={true}>
                  <div className="space-y-2">
                    {[
                      { label: "All", val: "any" },
                      { label: "Last Hour", val: "hour" },
                      { label: "Last 24 hours", val: "today" },
                      { label: "Last 7 days", val: "week" },
                      { label: "Last 30 days", val: "month" }
                    ].map(opt => (
                      <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedDate === opt.val ? 'border-purple-600' : 'border-gray-300 group-hover:border-purple-400'}`}>
                          {selectedDate === opt.val && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                        </div>
                        <input
                          type="radio"
                          className="hidden"
                          name="datePosted"
                          checked={selectedDate === opt.val}
                          onChange={() => setSelectedDate(opt.val)}
                        />
                        <span className={`text-sm ${selectedDate === opt.val ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Tags Cloud */}
                <FilterSection title="Tags Cloud" isOpen={true}>
                  <div className="flex flex-wrap gap-2">
                    {['design', 'marketing', 'business', 'developer', 'react', 'sales'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </FilterSection>

              </div>
            </div>
          </div>
        </div>

        <Footer />
      </PageTransition >
    </div >
  );
}

// Sub-components

function JobCard({ job, index, hasApplied, isSaved, onToggleSave }) {
  const isUrgent = index % 3 === 0; // Mock data
  const isPrivate = index % 4 === 0; // Mock data

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl font-bold text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            {job.employer?.companyName?.charAt(0) || "C"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {job.title}
            </h3>
            <div className="text-sm text-gray-500 flex flex-wrap gap-2 items-center mt-1">
              <span className="font-medium text-gray-700">{job.employer?.companyName}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1"><FiMapPin className="text-xs" /> {job.location}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1"><FiDollarSign className="text-xs" /> {job.salaryRange}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onToggleSave(null, job._id)}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <FiHeart className={`text-xl ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.jobType === 'Full-time' ? 'bg-green-100 text-green-700' :
          job.jobType === 'Part-time' ? 'bg-orange-100 text-orange-700' :
            'bg-blue-100 text-blue-700'
          }`}>
          {job.jobType}
        </span>
        {isUrgent && <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Urgent</span>}
        {isPrivate && <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Private</span>}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiClock /> {new Date(job.createdAt).toLocaleDateString()}
        </div>
        {hasApplied ? (
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
            <FiCheck /> Applied
          </div>
        ) : (
          <Link
            to={`/jobs/${job._id}`}
            className="text-sm font-bold text-gray-900 hover:text-purple-600 flex items-center gap-1 transition-colors"
          >
            Apply Now <span className="text-lg">»</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function FilterSection({ title, children, isOpen: defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-purple-50/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between font-bold text-gray-800 hover:bg-purple-100/50 transition-colors"
      >
        {title}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-purple-600 border-purple-600' : 'border-gray-300 group-hover:border-purple-400'}`}>
        {checked && <FiCheck className="text-white text-xs" />}
      </div>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{label}</span>
    </label>
  );
}
