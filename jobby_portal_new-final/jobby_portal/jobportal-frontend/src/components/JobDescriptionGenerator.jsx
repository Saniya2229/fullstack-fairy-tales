// components/JobDescriptionGenerator.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZap, FiCopy, FiCheck, FiLoader } from "react-icons/fi";
import { generateJobDescription } from "../api/ai";
import toast from "react-hot-toast";

const JobDescriptionGenerator = ({ isOpen, onClose, initialData = {}, onApply }) => {
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(null);
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({
        title: initialData.title || "",
        location: initialData.location || "",
        jobType: initialData.jobType || "Full-time",
        experience: initialData.experience || "",
        skills: initialData.skills || "",
        salaryRange: initialData.salaryRange || ""
    });

    const handleGenerate = async () => {
        if (!form.title.trim()) {
            toast.error("Job title is required");
            return;
        }

        setLoading(true);
        try {
            const jobInfo = {
                ...form,
                skills: form.skills.split(",").map(s => s.trim()).filter(Boolean)
            };
            const result = await generateJobDescription(jobInfo);
            if (result.success) {
                setDescription(result.description);
                toast.success(result.fallback ? "Description generated (basic mode)" : "Job description generated!");
            } else {
                toast.error("Failed to generate description");
            }
        } catch (error) {
            console.error("Generate JD error:", error);
            toast.error("Failed to generate description");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!description) return;
        navigator.clipboard.writeText(description.fullDescription || "");
        setCopied(true);
        toast.success("Description copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleApply = () => {
        if (onApply && description) {
            onApply(description);
            onClose();
        }
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
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FiZap className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">AI Job Description Generator</h2>
                                    <p className="text-orange-100 text-sm">Create professional job postings with AI</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {!description ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            placeholder="e.g. Frontend Developer"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={form.location}
                                            onChange={e => setForm({ ...form, location: e.target.value })}
                                            placeholder="e.g. Mumbai, Remote"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                        <select
                                            value={form.jobType}
                                            onChange={e => setForm({ ...form, jobType: e.target.value })}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                            <option>Freelance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                        <input
                                            type="text"
                                            value={form.experience}
                                            onChange={e => setForm({ ...form, experience: e.target.value })}
                                            placeholder="e.g. 2-4 years"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                                    <input
                                        type="text"
                                        value={form.skills}
                                        onChange={e => setForm({ ...form, skills: e.target.value })}
                                        placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <FiLoader className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FiZap />
                                            Generate Job Description
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{description.summary}</p>
                                </div>

                                {description.responsibilities?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Responsibilities</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                                            {description.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {description.requirements?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Requirements</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                                            {description.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {description.benefits?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                                            {description.benefits.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {description && (
                        <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                            >
                                {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                            {onApply && (
                                <button
                                    onClick={handleApply}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                                >
                                    Use This Description
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default JobDescriptionGenerator;
