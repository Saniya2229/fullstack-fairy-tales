// components/ResumeScoreCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTarget, FiCheckCircle, FiAlertCircle, FiLoader, FiTrendingUp } from "react-icons/fi";
import { scoreResume } from "../api/ai";
import toast from "react-hot-toast";

const ResumeScoreCard = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [resumeText, setResumeText] = useState("");

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            toast.error("Please paste your resume text");
            return;
        }

        setLoading(true);
        try {
            const result = await scoreResume(resumeText);
            if (result.success) {
                setAnalysis(result.analysis);
                toast.success(result.fallback ? "Resume analyzed (basic mode)" : "Resume analyzed!");
            } else {
                toast.error("Failed to analyze resume");
            }
        } catch (error) {
            console.error("Score resume error:", error);
            toast.error("Failed to analyze resume");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600 bg-green-100";
        if (score >= 60) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Needs Work";
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
                    className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FiTarget className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Resume Score Card</h2>
                                    <p className="text-emerald-200 text-sm">Get AI-powered feedback on your resume</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {!analysis ? (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-gray-700 font-medium">Paste your resume text</span>
                                    <textarea
                                        value={resumeText}
                                        onChange={e => setResumeText(e.target.value)}
                                        placeholder="Paste your resume content here..."
                                        className="mt-2 w-full h-48 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </label>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading || !resumeText.trim()}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <FiLoader className="animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <FiTarget />
                                            Analyze Resume
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Overall Score */}
                                <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreColor(analysis.overallScore)}`}>
                                        <span className="text-3xl font-bold">{analysis.overallScore}</span>
                                    </div>
                                    <div className="mt-2 text-xl font-semibold text-gray-800">
                                        {getScoreLabel(analysis.overallScore)}
                                    </div>
                                </div>

                                {/* Section Scores */}
                                {analysis.sections && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(analysis.sections).map(([key, section]) => (
                                            <div key={key} className="bg-gray-50 p-4 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-700 capitalize">{key}</span>
                                                    <span className={`px-2 py-1 rounded-full text-sm font-bold ${getScoreColor(section.score)}`}>
                                                        {section.score}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{section.feedback}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Strengths */}
                                {analysis.strengths?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <FiCheckCircle className="text-green-600" />
                                            Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.strengths.map((s, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-600">
                                                    <span className="text-green-500 mt-1">✓</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Improvements */}
                                {analysis.improvements?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <FiTrendingUp className="text-orange-600" />
                                            Areas to Improve
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.improvements.map((s, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-600">
                                                    <span className="text-orange-500 mt-1">→</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Tips */}
                                {analysis.tips?.length > 0 && (
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h4>
                                        <ul className="space-y-1">
                                            {analysis.tips.map((tip, i) => (
                                                <li key={i} className="text-blue-700 text-sm">• {tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {analysis && (
                        <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => { setAnalysis(null); setResumeText(""); }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                Analyze Another
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ResumeScoreCard;
