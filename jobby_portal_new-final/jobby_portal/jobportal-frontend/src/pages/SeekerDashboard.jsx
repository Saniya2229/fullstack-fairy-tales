// src/pages/SeekerDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, getSavedJobs } from "../api/user";
import { getMyResume, deleteResume } from "../api/resume";
import { getMyApplications, cancelApplication } from "../api/applications";
import {
    FiUser,
    FiBriefcase,
    FiFileText,
    FiEdit2,
    FiDownload,
    FiHome,
    FiHeart,
    FiX,
    FiZap,
    FiTrash2,
    FiUpload
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

// AI Components
import AIRecommendedJobs from "../components/AIRecommendedJobs";
import AIResumeBuilder from "../components/AIResumeBuilder";
import ResumeScoreCard from "../components/ResumeScoreCard";

export default function SeekerDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [resume, setResume] = useState(null);
    const [applications, setApplications] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // AI Modal States
    const [showAIResume, setShowAIResume] = useState(false);
    const [showResumeScore, setShowResumeScore] = useState(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        setLoading(true);
        try {
            const [profileData, resumeData, appsData, savedData] = await Promise.all([
                getProfile().catch(() => null),
                getMyResume().catch(() => null),
                getMyApplications().catch(() => []),
                getSavedJobs().catch(() => []),
            ]);

            setUser(profileData);
            setResume(resumeData);
            setApplications(appsData || []);
            setSavedJobs(savedData || []);
        } catch (err) {
            console.error("Failed to load dashboard:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loader />;
    if (!user) return <div className="p-6 text-center">Please log in to view your dashboard.</div>;

    // Calculate profile completion
    const fields = [
        user.firstName, user.lastName, user.email, user.phone,
        user.city, user.currentEducation_degree, user.currentEducation_college,
        user.previousEducation_10_school, user.previousEducation_12_school,
        user.internships?.length > 0, user.documents?.length > 0
    ];
    const completedFields = fields.filter(Boolean).length;
    const completion = Math.round((completedFields / fields.length) * 100);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Gradient Banner */}
            <div className="h-36 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400"></div>

            <div className="max-w-7xl mx-auto px-6 -mt-20">
                <div className="flex gap-6">
                    {/* Left Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                            {/* Profile Photo */}
                            <div className="text-center mb-6">
                                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mb-4 shadow-lg ring-4 ring-white overflow-hidden">
                                    {user.profilePhoto ? (
                                        <img src={user.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-white">
                                            {user.firstName?.[0]?.toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>

                            {/* Profile Completion */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 font-medium">Profile Completion</span>
                                    <span className="font-bold text-purple-600">{completion}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                                        style={{ width: `${completion}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-1">
                                <NavItem icon={FiUser} label="My Profile" onClick={() => navigate('/profile/steps')} />
                                <NavItem icon={FiBriefcase} label="My Applications" href="#applications" />
                                <NavItem icon={FiHeart} label="Saved Jobs" href="#saved-jobs" />
                                <NavItem icon={FiZap} label="AI Jobs" href="#ai-jobs" />
                                <NavItem icon={FiFileText} label="Resume" onClick={() => navigate('/resume')} />
                                <NavItem icon={FiHome} label="Home" onClick={() => navigate('/')} />
                            </nav>

                            {/* AI Tools */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 px-4">AI Tools</p>
                                <button
                                    onClick={() => setShowAIResume(true)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left font-medium"
                                >
                                    <FiZap className="w-5 h-5" />
                                    AI Resume Builder
                                </button>
                                <button
                                    onClick={() => setShowResumeScore(true)}
                                    className="w-full flex items-center gap-3 px-4 py-3 mt-1 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors text-left font-medium"
                                >
                                    <FiFileText className="w-5 h-5" />
                                    Resume Score
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6 pb-12">
                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-4">
                            <StatCard
                                icon={FiBriefcase}
                                value={applications.length}
                                label="Applications"
                                bgColor="bg-purple-50"
                                iconColor="text-purple-600"
                            />
                            <StatCard
                                icon={FiHeart}
                                value={savedJobs.length}
                                label="Saved Jobs"
                                bgColor="bg-pink-50"
                                iconColor="text-pink-600"
                            />
                            <StatCard
                                icon={FiFileText}
                                value={resume ? "Uploaded" : "Not Set"}
                                label="Resume"
                                bgColor="bg-blue-50"
                                iconColor="text-blue-600"
                            />
                            <StatCard
                                icon={FiUser}
                                value={`${completion}%`}
                                label="Profile"
                                bgColor="bg-green-50"
                                iconColor="text-green-600"
                            />
                        </div>

                        {/* My Applications Section */}
                        <Section id="applications" title="My Applications" editLink="/find-jobs">
                            {applications.length > 0 ? (
                                <div className="space-y-3">
                                    {applications.map((app) => (
                                        <ApplicationCard
                                            key={app._id}
                                            title={app.job?.title || "Untitled Job"}
                                            company={app.job?.employer?.companyName || app.job?.company || "Company"}
                                            date={new Date(app.appliedAt).toLocaleDateString()}
                                            status={app.status}
                                            onCancel={app.status === 'applied' ? async () => {
                                                if (window.confirm('Are you sure you want to cancel this application?')) {
                                                    try {
                                                        await cancelApplication(app._id);
                                                        toast.success('Application cancelled');
                                                        await loadDashboard();
                                                    } catch (err) {
                                                        toast.error(err.response?.data?.message || 'Failed to cancel');
                                                    }
                                                }
                                            } : null}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="You haven't applied to any jobs yet." />
                            )}
                        </Section>

                        {/* Saved Jobs Section */}
                        <Section id="saved-jobs" title="Saved Jobs" editLink="/find-jobs">
                            {savedJobs.length > 0 ? (
                                <div className="space-y-3">
                                    {savedJobs.map((job) => (
                                        <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{job.title}</h4>
                                                <p className="text-purple-600 text-sm font-medium">{job.company}</p>
                                                <p className="text-xs text-gray-400 mt-1">{job.location}</p>
                                            </div>
                                            <Link
                                                to={`/jobs/${job._id}`}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="No saved jobs yet." />
                            )}
                        </Section>

                        {/* Resume Section */}
                        <Section title="Resume" editLink="/resume">
                            {resume ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <FiFileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">My Resume</h4>
                                                <p className="text-sm text-gray-500">
                                                    {resume.updatedAt ? `Updated: ${new Date(resume.updatedAt).toLocaleDateString()}` : "Ready to view"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowAIResume(true)}
                                                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
                                                title="AI Resume Builder"
                                            >
                                                <FiZap className="w-5 h-5" />
                                            </button>
                                            <Link
                                                to="/resume"
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                                title="Upload/Edit Resume"
                                            >
                                                <FiUpload className="w-5 h-5" />
                                            </Link>
                                            {resume.pdfUrl && (
                                                <a href={resume.pdfUrl} target="_blank" rel="noreferrer" className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Download">
                                                    <FiDownload className="w-5 h-5" />
                                                </a>
                                            )}
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Delete your resume? This cannot be undone.')) {
                                                        try {
                                                            await deleteResume();
                                                            setResume(null);
                                                            toast.success('Resume deleted successfully');
                                                            // Force reload to ensure delete persists
                                                            loadDashboard();
                                                        } catch (err) {
                                                            console.error('Delete error:', err);
                                                            toast.error('Failed to delete resume');
                                                        }
                                                    }
                                                }}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                                title="Delete Resume"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Score Resume Button */}
                                    <button
                                        onClick={() => setShowResumeScore(true)}
                                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center justify-center gap-2"
                                    >
                                        <FiZap className="w-5 h-5" />
                                        Get AI Resume Score
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FiFileText className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 mb-4">No resume uploaded yet</p>
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to="/resume"
                                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                                        >
                                            <FiUpload className="w-5 h-5" />
                                            Upload Resume
                                        </Link>
                                        <button
                                            onClick={() => setShowAIResume(true)}
                                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition"
                                        >
                                            <FiZap className="w-5 h-5" />
                                            AI Resume Builder
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Section>

                        {/* AI Recommended Jobs Section */}
                        <div id="ai-jobs">
                            <AIRecommendedJobs />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Modals */}
            <AIResumeBuilder isOpen={showAIResume} onClose={() => setShowAIResume(false)} />
            <ResumeScoreCard isOpen={showResumeScore} onClose={() => setShowResumeScore(false)} />
        </div>
    );
}

// Component: Navigation Item
function NavItem({ icon: Icon, label, onClick, href }) {
    const baseClass = "w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors text-left font-medium";

    if (href) {
        return (
            <a href={href} className={baseClass}>
                <Icon className="w-5 h-5" />
                {label}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={baseClass}>
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );
}

// Component: Stat Card
function StatCard({ icon: Icon, value, label, bgColor, iconColor }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
                <div className="text-xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
            </div>
        </div>
    );
}

// Component: Section Card
function Section({ id, title, children, editLink }) {
    return (
        <div id={id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 scroll-mt-24">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                {editLink && (
                    <Link to={editLink} className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium">
                        <FiEdit2 className="w-4 h-4" /> Edit
                    </Link>
                )}
            </div>
            {children}
        </div>
    );
}

// Component: Application Card
function ApplicationCard({ title, company, date, status, onCancel }) {
    const statusStyles = {
        applied: "bg-blue-100 text-blue-700",
        hired: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        cancelled: "bg-gray-100 text-gray-600",
        interviewing: "bg-yellow-100 text-yellow-700",
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
            <div>
                <h4 className="font-bold text-gray-900">{title}</h4>
                <p className="text-purple-600 text-sm font-medium">{company}</p>
                <p className="text-xs text-gray-400 mt-1">Applied: {date}</p>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || statusStyles.applied}`}>
                    {status}
                </span>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all"
                        title="Cancel Application"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

// Component: Empty State
function EmptyState({ text }) {
    return (
        <p className="text-gray-400 italic text-sm py-4">{text}</p>
    );
}
