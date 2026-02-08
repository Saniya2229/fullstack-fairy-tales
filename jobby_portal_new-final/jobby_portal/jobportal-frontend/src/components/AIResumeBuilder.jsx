// components/AIResumeBuilder.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZap, FiDownload, FiCopy, FiCheck, FiLoader } from "react-icons/fi";
import { generateAIResume } from "../api/ai";
import toast from "react-hot-toast";

const AIResumeBuilder = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await generateAIResume();
            if (result.success) {
                setResume(result.resume);
                toast.success(result.fallback ? "Resume generated (basic mode)" : "AI Resume generated!");
            } else {
                toast.error("Failed to generate resume");
            }
        } catch (error) {
            console.error("Generate resume error:", error);
            toast.error("Failed to generate resume");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!resume) return;
        const text = formatResumeAsText(resume);
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Resume copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const formatResumeAsText = (r) => {
        let text = "";
        if (r.summary) text += `PROFESSIONAL SUMMARY\n${r.summary}\n\n`;
        if (r.skills?.length) text += `SKILLS\n${r.skills.join(", ")}\n\n`;
        if (r.experience?.length) {
            text += "EXPERIENCE\n";
            r.experience.forEach(exp => {
                text += `${exp.title} at ${exp.company} (${exp.duration})\n${exp.description}\n\n`;
            });
        }
        if (r.education?.length) {
            text += "EDUCATION\n";
            r.education.forEach(edu => {
                text += `${edu.degree} - ${edu.institution} (${edu.year})\n`;
            });
        }
        return text;
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
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FiZap className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">AI Resume Builder</h2>
                                    <p className="text-purple-200 text-sm">Generate a professional resume from your profile</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {!resume ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiZap className="text-3xl text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Generate</h3>
                                <p className="text-gray-500 mb-6">
                                    Click below to generate a professional resume based on your profile information.
                                </p>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 mx-auto disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <FiLoader className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FiZap />
                                            Generate AI Resume
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Summary */}
                                {resume.summary && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Professional Summary</h4>
                                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{resume.summary}</p>
                                    </div>
                                )}

                                {/* Skills */}
                                {resume.skills?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {resume.skills.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience */}
                                {resume.experience?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Experience</h4>
                                        <div className="space-y-3">
                                            {resume.experience.map((exp, i) => (
                                                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="font-medium text-gray-800">{exp.title}</div>
                                                    <div className="text-sm text-gray-500">{exp.company} • {exp.duration}</div>
                                                    <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {resume.education?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Education</h4>
                                        <div className="space-y-2">
                                            {resume.education.map((edu, i) => (
                                                <div key={i} className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="font-medium text-gray-800">{edu.degree}</div>
                                                    <div className="text-sm text-gray-500">{edu.institution} • {edu.year}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {resume && (
                        <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                            >
                                {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                            >
                                <FiZap />
                                Regenerate
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AIResumeBuilder;
