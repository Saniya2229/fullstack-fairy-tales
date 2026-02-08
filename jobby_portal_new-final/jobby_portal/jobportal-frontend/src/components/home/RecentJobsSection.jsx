import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiHeart, FiMapPin, FiBriefcase, FiUser, FiPenTool, FiCode, FiTrendingUp, FiPieChart, FiTarget, FiCpu, FiUsers, FiClock } from "react-icons/fi";

const RecentJobsSection = ({ activeTab, setActiveTab, filteredJobs, savedJobIds, handleToggleSave }) => {
    return (
        <section className="py-24 bg-white relative">
            <div className="container-custom relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900 tracking-tight leading-tight">Latest Opportunities</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Browse through the newest listings from top companies and find the perfect match for your skills.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {['Recent Jobs', 'Featured Jobs', 'Freelancer', 'Part Time', 'Full Time'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${activeTab === tab
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 ring-2 ring-purple-50 ring-offset-2'
                                : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-slate-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Job List - Cards */}
                <div className="space-y-4">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, i) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                className="group relative bg-white rounded-3xl p-6 sm:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 border border-slate-100 hover:border-purple-100"
                            >
                                <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

                                    {/* Logo Box */}
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl font-bold text-slate-300 border border-slate-100 group-hover:border-purple-100 group-hover:scale-105 transition-all duration-300 overflow-visible relative">
                                            {/* Company Logo logic */}
                                            {job.employer?.companyLogo ? (
                                                <img src={job.employer.companyLogo} alt={job.employer.companyName} className="w-12 h-12 object-contain" />
                                            ) : (
                                                <div className="text-purple-500 bg-purple-50/50 w-full h-full flex items-center justify-center text-3xl rounded-2xl">
                                                    {(job.category === 'Design') ? <FiPenTool /> :
                                                        (job.category === 'Development') ? <FiCode /> :
                                                            (job.category === 'Marketing') ? <FiTrendingUp /> :
                                                                (job.category === 'Finance') ? <FiPieChart /> :
                                                                    (job.category === 'Healthcare') ? <FiHeart /> :
                                                                        (job.category === 'Sales') ? <FiTarget /> :
                                                                            (job.category === 'Engineering') ? <FiCpu /> :
                                                                                (job.category === 'HR') ? <FiUsers /> :
                                                                                    <FiBriefcase />}
                                                </div>
                                            )}

                                            {/* Urgent/Private Badges - Floating on logo for style */}
                                            {i % 4 === 0 && (
                                                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-sm" title="Urgent" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-grow w-full">
                                        <div className="flex flex-col md:flex-row md:justify-between mb-3">
                                            <div>
                                                <Link to={`/jobs/${job._id}`}>
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-1.5 cursor-pointer">
                                                        {job.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-slate-500 text-sm font-medium">
                                                    {job.employer?.companyName}
                                                </p>
                                            </div>

                                            {/* Job Type Tag + Heart */}
                                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${job.jobType === 'Full-time' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    job.jobType === 'Part-time' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                    }`}>
                                                    {job.jobType}
                                                </span>

                                                <button
                                                    onClick={(e) => handleToggleSave(e, job._id)}
                                                    className={`p-2.5 rounded-full border transition-all duration-300 ${savedJobIds.includes(job._id)
                                                        ? 'bg-red-50 border-red-100 text-red-500'
                                                        : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <FiHeart className={savedJobIds.includes(job._id) ? 'fill-red-500' : ''} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Meta Tags */}
                                        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-slate-500 mb-6">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <FiMapPin className="text-slate-400 text-lg" /> {job.location || "Remote"}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <FiBriefcase className="text-slate-400 text-lg" /> {job.salaryRange || "Competitive"}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <FiClock className="text-slate-400 text-lg" /> Posted 2 days ago
                                            </span>
                                        </div>
                                    </div>

                                    {/* Apply Action */}
                                    <div className="flex-shrink-0 self-center md:self-center w-full md:w-auto">
                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="w-full md:w-auto py-3 px-8 rounded-full bg-slate-50 text-slate-900 font-bold hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-200"
                                        >
                                            Details <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <FiBriefcase className="mx-auto text-4xl text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No active jobs found for this category.</p>
                        </div>
                    )}
                </div>

                <div className="text-center mt-16">
                    <Link to="/jobs" className="btn-primary inline-flex items-center gap-2 px-10">
                        Explore All Listings
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecentJobsSection;
