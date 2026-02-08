import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiMapPin, FiDollarSign, FiClock, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { getMyJobs, deleteJob } from "../../api/employer";
import Loader from "../../components/Loader";

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadJobs();
    }, []);

    async function loadJobs() {
        try {
            const data = await getMyJobs();
            setJobs(data || []);
        } catch (err) {
            console.error("Failed to load jobs", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(jobId) {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await deleteJob(jobId);
            setJobs(jobs.filter(j => j._id !== jobId));
        } catch (err) {
            console.error("Failed to delete job", err);
            alert("Failed to delete job");
        }
    }

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader />
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link to="/dashboard/employer" className="text-sm text-gray-500 hover:text-purple-600 mb-2 inline-block">
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
                    <p className="text-gray-500 mt-1">View and manage your job postings</p>
                </div>
                <Link
                    to="/jobs/create"
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-0.5"
                >
                    <FiPlus className="text-xl" /> Post New Job
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search jobs by title or location..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredJobs.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-200 text-4xl">
                            <FiBriefcaseIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-500 mb-6">Get started by posting your first job opportunity.</p>
                        <Link
                            to="/jobs/create"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                            <FiPlus /> Post Job
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Job Details</th>
                                    <th className="px-6 py-4">Applicants</th>
                                    <th className="px-6 py-4">Posted Date</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredJobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 text-lg mb-1">{job.title}</div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><FiMapPin className="text-gray-400" /> {job.location}</span>
                                                <span className="flex items-center gap-1"><FiDollarSign className="text-gray-400" /> {job.salaryRange}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[...Array(Math.min(3, job.applicantsCount || 0))].map((_, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                    ))}
                                                    {(job.applicantsCount || 0) > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                                            +{job.applicantsCount - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {job.applicantsCount || 0} Applicants
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FiClock className="text-gray-400" />
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye />
                                                </Link>
                                                <Link
                                                    to={`/jobs/${job._id}/edit`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Job"
                                                >
                                                    <FiEdit2 />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(job._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Job"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const FiBriefcaseIcon = () => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
