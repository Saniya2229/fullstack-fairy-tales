// src/pages/applications/MyApplications.jsx
import React, { useEffect, useState } from "react";
import { getMyApplications, cancelApplication } from "../../api/applications";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
    FiMapPin, FiDollarSign, FiClock, FiBriefcase, FiArrowLeft,
    FiCheckCircle, FiXCircle, FiAlertCircle, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function MyApplications() {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState("all");
    const nav = useNavigate();

    async function loadApplications() {
        try {
            const data = await getMyApplications();
            setApplications(data);
        } catch (err) {
            console.error("Error loading applications:", err);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadApplications();
    }, []);

    async function handleCancelApplication(applicationId) {
        if (window.confirm('Are you sure you want to cancel this application?')) {
            try {
                await cancelApplication(applicationId);
                toast.success('Application cancelled successfully');
                loadApplications(); // Refresh the list
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to cancel application');
            }
        }
    }

    const filteredApplications = filter === "all"
        ? applications
        : applications.filter(app => app.status === filter);

    const statusConfig = {
        applied: {
            label: "Applied",
            color: "bg-blue-500",
            textColor: "text-blue-700",
            bgColor: "bg-blue-50",
            icon: FiClock
        },
        reviewed: {
            label: "Reviewed",
            color: "bg-purple-500",
            textColor: "text-purple-700",
            bgColor: "bg-purple-50",
            icon: FiCheckCircle
        },
        interview: {
            label: "Interview",
            color: "bg-orange-500",
            textColor: "text-orange-700",
            bgColor: "bg-orange-50",
            icon: FiAlertCircle
        },
        rejected: {
            label: "Rejected",
            color: "bg-red-500",
            textColor: "text-red-700",
            bgColor: "bg-red-50",
            icon: FiXCircle
        },
        hired: {
            label: "Hired",
            color: "bg-green-500",
            textColor: "text-green-700",
            bgColor: "bg-green-50",
            icon: FiCheckCircle
        },
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
                    <button onClick={() => nav(-1)} className="text-gray-500 hover:text-purple-600 flex items-center gap-2 mb-4 transition-colors">
                        <FiArrowLeft /> Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                    <p className="text-gray-500 mt-1">Track all your job applications in one place</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
                                ? `border-${config.color.replace('bg-', '')} ${config.bgColor}`
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
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-purple-500/5 hover:border-purple-100 transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            {/* Job Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div>
                                                        <Link
                                                            to={`/jobs/${application.job?._id}`}
                                                            className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors"
                                                        >
                                                            {application.job?.title || "Untitled Job"}
                                                        </Link>
                                                        <p className="text-gray-500 font-medium text-sm mt-1">
                                                            {application.job?.employer?.companyName || application.job?.company || "Company"}
                                                        </p>
                                                    </div>

                                                    <div className={`px-4 py-2 ${status.bgColor} ${status.textColor} rounded-full flex items-center gap-2 font-bold text-sm`}>
                                                        <StatusIcon className="text-lg" />
                                                        {status.label}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <FiMapPin className="text-gray-400" />
                                                        {application.job?.location || "Location"}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <FiClock className="text-gray-400" />
                                                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {application.notes && (
                                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-semibold">Note:</span> {application.notes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                <Link
                                                    to={`/jobs/${application.job?._id}`}
                                                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all text-center"
                                                >
                                                    View Job
                                                </Link>
                                                {application.status === 'applied' && (
                                                    <button
                                                        onClick={() => handleCancelApplication(application._id)}
                                                        className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-center flex items-center justify-center gap-2"
                                                    >
                                                        <FiX /> Cancel
                                                    </button>
                                                )}
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
                                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                                    {filter === "all"
                                        ? "Start applying for jobs to see them here!"
                                        : "Try selecting a different filter to see your applications."}
                                </p>
                                {filter === "all" && (
                                    <Link
                                        to="/jobs"
                                        className="inline-block px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                                    >
                                        Browse Jobs
                                    </Link>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
