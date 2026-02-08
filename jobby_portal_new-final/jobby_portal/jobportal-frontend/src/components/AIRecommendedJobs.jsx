// components/AIRecommendedJobs.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiZap, FiMapPin, FiBriefcase, FiLoader, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAIJobMatches } from "../api/ai";
import toast from "react-hot-toast";

const AIRecommendedJobs = () => {
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAIJobMatches();
            if (result.success) {
                setMatches(result.matches || []);
            } else {
                setError("Failed to load recommendations");
            }
        } catch (err) {
            console.error("Fetch AI matches error:", err);
            setError("Failed to load recommendations");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FiZap className="text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">AI Job Recommendations</h3>
                </div>
                <div className="flex items-center justify-center py-8">
                    <FiLoader className="text-2xl text-purple-600 animate-spin" />
                    <span className="ml-2 text-gray-500">Finding best matches...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FiZap className="text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">AI Job Recommendations</h3>
                </div>
                <p className="text-gray-500 text-center py-4">{error}</p>
                <button
                    onClick={fetchMatches}
                    className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FiZap className="text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">AI Job Recommendations</h3>
                        <p className="text-xs text-gray-500">Based on your profile</p>
                    </div>
                </div>
                <button
                    onClick={fetchMatches}
                    className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                >
                    Refresh <FiArrowRight className="text-xs" />
                </button>
            </div>

            {matches.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                    Complete your profile to get personalized job recommendations!
                </p>
            ) : (
                <div className="space-y-3">
                    {matches.slice(0, 5).map((match, index) => (
                        <motion.div
                            key={match.jobId || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={`/jobs/${match.job?._id || match.jobId}`}
                                className="block bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-purple-200 transition group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-gray-800 group-hover:text-purple-600 transition">
                                                {match.job?.title || "Job Position"}
                                            </h4>
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                                {match.matchScore}% match
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FiBriefcase />
                                                {match.job?.employer?.companyName || "Company"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiMapPin />
                                                {match.job?.location || "Location"}
                                            </span>
                                        </div>
                                        {match.matchReasons?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {match.matchReasons.slice(0, 2).map((reason, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                                                        {reason}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <FiArrowRight className="text-gray-400 group-hover:text-purple-600 transition" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            <Link
                to="/jobs"
                className="mt-4 block text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
                View All Jobs
            </Link>
        </div>
    );
};

export default AIRecommendedJobs;
