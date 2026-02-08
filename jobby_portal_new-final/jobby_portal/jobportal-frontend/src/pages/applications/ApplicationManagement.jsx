// src/pages/applications/ApplicationManagement.jsx
import React, { useEffect, useState } from "react";
import { getEmployerApplications, updateApplication } from "../../api/applications";
import { Link, useNavigate } from "react-router-dom";
import {
    FiMapPin, FiMail, FiUser, FiArrowLeft, FiBriefcase,
    FiCheckCircle, FiXCircle, FiAlertCircle, FiClock, FiStar
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplicationManagement() {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [updating, setUpdating] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await getEmployerApplications();
                setApplications(data);
            } catch (err) {
                console.error("Error loading applications:", err);
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setUpdating(applicationId);
            const updated = await updateApplication(applicationId, { status: newStatus });
            setApplications(prev =>
                prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
            );
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status");
        } finally {
            setUpdating(null);
        }
    };

    const handleNotesChange = async (applicationId, notes) => {
        try {
            await updateApplication(applicationId, { notes });
            setApplications(prev =>
                prev.map(app => app._id === applicationId ? { ...app, notes } : app)
            );
        } catch (err) {
            console.error("Error updating notes:", err);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesFilter = filter === "all" || app.status === filter;
        const matchesSearch = !searchTerm ||
            app.applicant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.applicant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const statusConfig = {
        applied: { label: "Applied", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", icon: FiClock },
        reviewed: { label: "Reviewed", color: "bg-purple-500", textColor: "text-purple-700", bgColor: "bg-purple-50", icon: FiCheckCircle },
        interview: { label: "Interview", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50", icon: FiAlertCircle },
        rejected: { label: "Rejected", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50", icon: FiXCircle },
        hired: { label: "Hired", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50", icon: FiCheckCircle },
    };

    const getStatusCount = (status) => {
        return applications.filter(app => app.status === status).length;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <button onClick={() => nav('/dashboard/employer')} className="text-gray-500 hover:text-purple-600 flex items-center gap-2 mb-4 transition-colors">
                        <FiArrowLeft /> Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Application Management</h1>
                    <p className="text-gray-500 mt-1">Review and manage job applications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <button
                        onClick={() => setFilter("all")}
                        className={`p-4 rounded-xl border-2 transition-all ${filter === "all"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 bg-white hover:border-purple-200"
                            }`}
                    >
                        <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
                        <div className="text-sm text-gray-500 font-medium">Total</div>
                    </button>

                    {Object.entries(statusConfig).map(([status, config]) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`p-4 rounded-xl border-2 transition-all ${filter === status
                                ? `${config.bgColor} border-${config.color.replace('bg-', '')}`
                                : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                        >
                            <div className="text-2xl font-bold text-gray-900">{getStatusCount(status)}</div>
                            <div className={`text-sm font-medium ${filter === status ? config.textColor : 'text-gray-500'}`}>
                                {config.label}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by applicant name or job title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm"
                    />
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((application, index) => {
                                const status = statusConfig[application.status] || statusConfig.applied;
                                const StatusIcon = status.icon;

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        key={application._id}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                            {/* Applicant Info */}
                                            <div className="lg:col-span-2">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                                        {application.applicant?.firstName?.charAt(0) || <FiUser />}
                                                    </div>

                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {application.applicant?.firstName} {application.applicant?.lastName}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                            <FiMail className="text-gray-400" />
                                                            {application.applicant?.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                            <FiBriefcase className="text-gray-400" />
                                                            Applied for: <Link to={`/jobs/${application.job?._id}`} className="text-purple-600 hover:underline font-medium">
                                                                {application.job?.title}
                                                            </Link>
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-2">
                                                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <div className={`px-4 py-2 ${status.bgColor} ${status.textColor} rounded-full flex items-center gap-2 font-bold text-sm`}>
                                                        <StatusIcon />
                                                        {status.label}
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <div className="mt-4">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                                                    <textarea
                                                        value={application.notes || ""}
                                                        onChange={(e) => handleNotesChange(application._id, e.target.value)}
                                                        placeholder="Add notes about this applicant..."
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm"
                                                        rows="2"
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                                                    <select
                                                        value={application.status}
                                                        onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                                        disabled={updating === application._id}
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {Object.entries(statusConfig).map(([value, config]) => (
                                                            <option key={value} value={value}>{config.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Link
                                                        to={`/profile/${application.applicant?._id}`}
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all text-center text-sm"
                                                    >
                                                        View Profile
                                                    </Link>
                                                    {application.resume && (
                                                        <a
                                                            href={application.resume}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all text-center text-sm"
                                                        >
                                                            View Resume
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 text-3xl">
                                    <FiBriefcase />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {filter === "all" ? "No applications yet" : `No ${statusConfig[filter]?.label.toLowerCase()} applications`}
                                </h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    {filter === "all"
                                        ? "Applications will appear here once job seekers apply for your jobs."
                                        : "Try selecting a different filter to see applications."}
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
