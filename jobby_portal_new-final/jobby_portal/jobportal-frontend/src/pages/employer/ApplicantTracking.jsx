import React, { useState, useEffect } from "react";
import { FiSearch, FiMoreVertical, FiClock, FiStar, FiMessageSquare, FiDownload, FiXCircle } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { getEmployerApplications, updateApplicationStatus, updateApplicationNotes, updateApplicationRating, updateApplication } from "../../api/applications";
import Loader from "../../components/Loader";

export default function ApplicantTracking() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await getEmployerApplications();
            setApplications(data);
        } catch (err) {
            console.error("Failed to fetch applications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateApplicationStatus(id, status);
            setApplications(apps => apps.map(app => app._id === id ? { ...app, status } : app));
            if (selectedApp && selectedApp._id === id) {
                setSelectedApp(prev => ({ ...prev, status }));
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleRatingChange = async (id, rating) => {
        try {
            await updateApplicationRating(id, rating);
            setApplications(apps => apps.map(app => app._id === id ? { ...app, rating } : app));
            if (selectedApp && selectedApp._id === id) {
                setSelectedApp(prev => ({ ...prev, rating }));
            }
        } catch (err) {
            console.error("Failed to update rating", err);
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesStatus = filterStatus === "all" || app.status === filterStatus;
        const matchesSearch =
            app.applicant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.applicant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const columns = [
        { id: "applied", label: "New Applied", color: "bg-blue-50 text-blue-700 border-blue-200" },
        { id: "reviewed", label: "Reviewed", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        { id: "interview", label: "Interview", color: "bg-purple-50 text-purple-700 border-purple-200" },
        { id: "hired", label: "Hired", color: "bg-green-50 text-green-700 border-green-200" },
        { id: "rejected", label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" }
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Applicant Tracking</h1>
                        <p className="text-gray-500 mt-1">Manage and track candidates across all your jobs</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            {columns.map(col => (
                                <option key={col.id} value={col.id}>{col.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {columns.map(column => (
                        <div key={column.id} className="min-w-[300px] flex-1">
                            <div className={`flex items-center justify-between p-3 rounded-t-lg border-b-2 ${column.color} bg-white`}>
                                <span className="font-semibold">{column.label}</span>
                                <span className="bg-white/50 px-2 py-0.5 rounded text-sm font-bold">
                                    {applications.filter(a => a.status === column.id).length}
                                </span>
                            </div>

                            <div className="bg-gray-100/50 p-3 rounded-b-lg min-h-[500px] space-y-3">
                                {filteredApps
                                    .filter(app => app.status === column.id)
                                    .map(app => (
                                        <motion.div
                                            layoutId={app._id}
                                            key={app._id}
                                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    {app.applicant?.profilePicture ? (
                                                        <img src={app.applicant.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                                            {app.applicant?.firstName?.[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {app.applicant?.firstName} {app.applicant?.lastName}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 truncate max-w-[140px]">
                                                            {app.job?.title}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1 hover:bg-gray-100 rounded">
                                                        <FiMoreVertical className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <FiClock className="w-3 h-3" />
                                                    {new Date(app.appliedAt).toLocaleDateString()}
                                                </span>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <FiStar
                                                            key={star}
                                                            className={`w-3 h-3 ${star <= (app.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                                                {column.id !== 'hired' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'hired'); }}
                                                        className="flex-1 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded text-center"
                                                    >
                                                        Hire
                                                    </button>
                                                )}
                                                {column.id !== 'rejected' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'rejected'); }}
                                                        className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded text-center"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                                {column.id === 'applied' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'reviewed'); }}
                                                        className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded text-center"
                                                    >
                                                        Review
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Modal (Simplified) */}
                <AnimatePresence>
                    {selectedApp && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedApp(null)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-6 border-b flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Application Details</h2>
                                    <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <FiXCircle className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-600">
                                            {selectedApp.applicant?.firstName?.[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{selectedApp.applicant?.firstName} {selectedApp.applicant?.lastName}</h3>
                                            <p className="text-gray-500">{selectedApp.applicant?.email}</p>
                                            <p className="text-purple-600 font-medium mt-1">Applied for: {selectedApp.job?.title}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="text-sm font-medium text-gray-500 block mb-2">Status</label>
                                            <select
                                                className="w-full p-2 border rounded bg-white"
                                                value={selectedApp.status}
                                                onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                                            >
                                                {columns.map(col => (
                                                    <option key={col.id} value={col.id}>{col.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="text-sm font-medium text-gray-500 block mb-2">Rating</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleRatingChange(selectedApp._id, star)}
                                                        className="p-1 hover:scale-110 transition"
                                                    >
                                                        <FiStar
                                                            className={`w-6 h-6 ${star <= (selectedApp.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-2">Notes</label>
                                        <textarea
                                            className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Add private notes about this candidate..."
                                            defaultValue={selectedApp.notes}
                                            onBlur={(e) => updateApplication(selectedApp._id, { notes: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2">
                                            <FiMessageSquare /> Send Message
                                        </button>
                                        {selectedApp.resume && (
                                            <button className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                                <FiDownload /> Download Resume
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
