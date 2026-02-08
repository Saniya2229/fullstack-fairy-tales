import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign } from "react-icons/fi";
import { getProfile } from "../../api/user";
import { listJobs } from "../../api/jobs";
import { Link } from "react-router-dom";

export default function JobSearch() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationSearch, setLocationSearch] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [userData, jobsResponse] = await Promise.all([
                    getProfile(),
                    listJobs()
                ]);
                setUser(userData);
                setJobs(jobsResponse.data || []);
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchTitle = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.employer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchLocation = !locationSearch || job.location?.toLowerCase().includes(locationSearch.toLowerCase());
        return matchTitle && matchLocation;
    });

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar user={user} onProfileUpdate={async () => {
                const userData = await getProfile();
                setUser(userData);
            }} />
            <div className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Find Your Dream Job</h1>
                        <p className="text-gray-500">Browse thousands of job openings</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                        {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.firstName?.[0] || "U"}</span>
                        )}
                    </div>
                </header>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4">
                    <div className="flex-1 flex items-center gap-3 px-4 bg-gray-50 rounded-lg">
                        <FiSearch className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Job title, skills, or company"
                            className="bg-transparent w-full py-3 outline-none text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 flex items-center gap-3 px-4 bg-gray-50 rounded-lg">
                        <FiMapPin className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Location"
                            className="bg-transparent w-full py-3 outline-none text-gray-700"
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                        />
                    </div>
                    <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                        Search
                    </button>
                </div>

                {/* Job List */}
                <div className="space-y-4">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <Link to={`/jobs/${job._id}`} key={job._id} className="block bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition cursor-pointer group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition">{job.title}</h3>
                                        <div className="text-gray-500 font-medium">{job.employer?.companyName || "Confidential"}</div>
                                    </div>
                                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {job.jobType}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <FiMapPin /> {job.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiDollarSign /> {job.salaryRange}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiBriefcase /> {new Date(job.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No jobs found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
