import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiBriefcase, FiUsers, FiTrendingUp, FiClock, FiMoreVertical, FiEye, FiEdit2, FiTrash2, FiPhone, FiMapPin, FiMail } from "react-icons/fi";
import { getEmployerProfile, getMyJobs, deleteJob } from "../api/employer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      try {
        const profileData = await getEmployerProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load profile", err);
      }

      try {
        const jobsData = await getMyJobs();
        setJobs(jobsData || []);
      } catch (err) {
        console.error("Failed to load jobs", err);
        setJobs([]);
      }
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader />
    </div>
  );

  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicantsCount || 0), 0);
  const activeJobs = jobs.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content - with proper top padding for fixed navbar */}
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {profile?.companyName || profile?.name || "Employer"}</p>
          </div>
          <Link
            to="/jobs/create"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40"
          >
            <FiPlus className="text-xl" /> Post New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FiBriefcase />}
            label="Total Jobs"
            value={totalJobs}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <Link to="/applications" className="block">
            <StatCard
              icon={<FiUsers />}
              label="Total Applicants"
              value={totalApplicants}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
              clickable
            />
          </Link>
          <StatCard
            icon={<FiTrendingUp />}
            label="Active Jobs"
            value={activeJobs}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Jobs Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Job Postings</h2>
              <Link to="/jobs" className="text-sm text-purple-600 font-medium hover:text-purple-700">View All</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Posted Date</th>
                    <th className="px-6 py-4 text-center">Applicants</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.slice(0, 5).map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{job.title}</div>
                        <div className="text-xs text-gray-500">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-gray-400" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {job.applicantsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(menuOpen === job._id ? null : job._id);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FiMoreVertical />
                        </button>

                        {menuOpen === job._id && (
                          <div className="absolute right-6 top-12 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <FiEye className="text-gray-400" /> View Details
                            </Link>
                            <Link
                              to={`/jobs/${job._id}/edit`}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <FiEdit2 className="text-gray-400" /> Edit Job
                            </Link>
                            <button
                              onClick={async () => {
                                if (window.confirm('Delete this job?')) {
                                  try {
                                    await deleteJob(job._id);
                                    setJobs(jobs.filter(j => j._id !== job._id));
                                    setMenuOpen(null);
                                  } catch (e) { alert('Failed to delete'); }
                                }
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="text-gray-400 mb-2">
                          <FiBriefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        </div>
                        <p className="text-gray-500">No jobs posted yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Click "Post New Job" to get started!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Company Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Company Profile</h2>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {profile?.companyName?.[0]?.toUpperCase() || "C"}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{profile?.companyName || "Company Name"}</div>
                <div className="text-sm text-gray-500">{profile?.email}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiPhone className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400 uppercase font-semibold">Phone</div>
                  <div className="text-sm font-medium text-gray-900">{profile?.phone || "Not added"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiMapPin className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400 uppercase font-semibold">Location</div>
                  <div className="text-sm font-medium text-gray-900">{profile?.address || "Not added"}</div>
                </div>
              </div>
            </div>

            <Link
              to="/profile/employer"
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor, iconColor, clickable }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all ${clickable ? 'hover:shadow-md hover:border-purple-200 cursor-pointer' : 'hover:shadow-sm'}`}>
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center text-2xl ${iconColor}`}>
        {icon}
      </div>
      <div>
        <div className="text-gray-500 text-sm font-medium">{label}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
