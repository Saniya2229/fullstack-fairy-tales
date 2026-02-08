// components/AICandidateRanking.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAward, FiLoader, FiUser, FiStar, FiAlertCircle } from "react-icons/fi";
import { rankCandidates } from "../api/ai";
import toast from "react-hot-toast";

const AICandidateRanking = ({ isOpen, onClose, jobId, jobTitle }) => {
    const [loading, setLoading] = useState(false);
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        if (isOpen && jobId) {
            handleRank();
        }
    }, [isOpen, jobId]);

    const handleRank = async () => {
        setLoading(true);
        try {
            const result = await rankCandidates(jobId);
            if (result.success) {
                setRankings(result.rankings);
                if (result.rankings.length === 0) {
                    toast.info("No candidates to rank");
                } else {
                    toast.success(result.fallback ? "Candidates ranked (basic mode)" : "Candidates ranked by AI!");
                }
            } else {
                toast.error("Failed to rank candidates");
            }
        } catch (error) {
            console.error("Rank candidates error:", error);
            toast.error("Failed to rank candidates");
        } finally {
            setLoading(false);
        }
    };

    const getRankColor = (rank) => {
        if (rank === 1) return "bg-yellow-500 text-white";
        if (rank === 2) return "bg-gray-400 text-white";
        if (rank === 3) return "bg-amber-700 text-white";
        return "bg-gray-200 text-gray-700";
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-gray-600";
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FiAward className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">AI Candidate Ranking</h2>
                                    <p className="text-blue-200 text-sm">{jobTitle || "Job Position"}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <FiLoader className="text-4xl text-blue-600 animate-spin mb-4" />
                                <p className="text-gray-500">Analyzing candidates...</p>
                            </div>
                        ) : rankings.length === 0 ? (
                            <div className="text-center py-12">
                                <FiUser className="text-4xl text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No candidates to rank</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {rankings.map((ranking, index) => (
                                    <motion.div
                                        key={ranking.candidateId || index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border rounded-xl p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Rank Badge */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankColor(ranking.rank)}`}>
                                                {ranking.rank}
                                            </div>

                                            {/* Candidate Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-800">
                                                        {ranking.application?.applicant?.firstName || "Candidate"} {ranking.application?.applicant?.lastName || ""}
                                                    </h4>
                                                    <span className={`text-lg font-bold ${getScoreColor(ranking.score)}`}>
                                                        {ranking.score}%
                                                    </span>
                                                </div>

                                                {/* Strengths */}
                                                {ranking.strengths?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {ranking.strengths.map((s, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                                                ✓ {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Concerns */}
                                                {ranking.concerns?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {ranking.concerns.map((c, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                                                                ⚠ {c}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Recommendation */}
                                                <p className="text-sm text-gray-600 italic">{ranking.recommendation}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
                        <button
                            onClick={handleRank}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            <FiAward />
                            Re-rank
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AICandidateRanking;
