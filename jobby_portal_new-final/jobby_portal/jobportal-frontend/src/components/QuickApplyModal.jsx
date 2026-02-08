import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiChevronRight, FiChevronLeft, FiUploadCloud, FiFileText, FiTrash2, FiBriefcase, FiMapPin, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { sendOTP, verifyOTP } from "../api/otp";
import { createApplication } from "../api/applications";

export default function QuickApplyModal({ isOpen, onClose, job, user, onSuccess }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        location: "",
        organization: "",
        education: "",
        userType: "college_student",
        differentlyAbled: "no",
        otp: "",
        resume: null,
    });

    // Pre-fill data if user is logged in
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                location: user.location || "",
            }));
        }
    }, [user]);

    // OTP Countdown Timer
    useEffect(() => {
        let interval;
        if (otpSent && otpTimer > 0 && step === 3) {
            interval = setInterval(() => {
                setOtpTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, otpTimer, step]);

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (!canResend || sendingOtp) return;
        try {
            setSendingOtp(true);
            await sendOTP(formData.email);
            setOtpTimer(60);
            setCanResend(false);
            toast.success("OTP resent to your email!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setSendingOtp(false);
        }
    };

    // if (!isOpen) return null;

    const handleNext = async () => {
        // Basic validation
        if (step === 1) {
            if (!formData.firstName || !formData.email || !formData.phone || !formData.location || !formData.gender) {
                toast.error("Please fill all required fields");
                return;
            }
        }
        if (step === 2) {
            if (!formData.organization || !formData.education || !formData.userType) {
                toast.error("Please fill all required fields");
                return;
            }
            // Send OTP when moving to Step 3
            if (sendingOtp) return; // Prevent duplicate sends
            try {
                setSendingOtp(true);
                setLoading(true);
                await sendOTP(formData.email);
                setOtpSent(true);
                toast.success("OTP sent to your email!");
                setStep(3);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to send OTP");
            } finally {
                setLoading(false);
                setSendingOtp(false);
            }
            return;
        }
        if (step === 3) {
            if (formData.otp.length !== 6) {
                toast.error("Please enter valid 6-digit OTP");
                return;
            }
            // Verify OTP
            try {
                setLoading(true);
                const result = await verifyOTP(formData.email, formData.otp);
                if (result.verified) {
                    setOtpVerified(true);
                    toast.success("Email verified successfully!");
                    setStep(4);
                } else {
                    toast.error("Invalid OTP. Please try again.");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to verify OTP");
            } finally {
                setLoading(false);
            }
            return;
        }
        if (step === 4) {
            // Submit application
            try {
                setLoading(true);
                await createApplication(job._id);
                toast.success("Application submitted successfully!");
                setStep(5);
                // Notify parent component
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                        onClose();
                    }, 2000); // Close after 2 seconds
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to submit application");
            } finally {
                setLoading(false);
            }
            return;
        }

        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }
            setFormData((prev) => ({ ...prev, resume: file }));
        }
    };

    const steps = [
        { id: 1, title: "Basic Details" },
        { id: 2, title: "Professional" },
        { id: 3, title: "Verify" },
        { id: 4, title: "Resume" },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{job?.title || "Job Application"}</h2>
                        <p className="text-sm text-gray-500">{job?.company || "Company Name"}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <FiX className="text-gray-500 text-xl" />
                    </button>
                </div>

                {/* Progress Bar (Hide on success step) */}
                {step < 5 && (
                    <div className="px-6 py-4 bg-white">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10" />
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-purple-600 -z-10 transition-all duration-300"
                                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((s) => (
                                <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step >= s.id
                                            ? "bg-purple-600 border-purple-600 text-white"
                                            : "bg-white border-gray-300 text-gray-400"
                                            }`}
                                    >
                                        {step > s.id ? <FiCheck /> : s.id}
                                    </div>
                                    <span className={`text-xs font-medium ${step >= s.id ? "text-purple-600" : "text-gray-400"}`}>
                                        {s.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Basic Details */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                <div className="flex gap-4">
                                    {["Male", "Female", "Other"].map((g) => (
                                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g.toLowerCase()}
                                                checked={formData.gender === g.toLowerCase()}
                                                onChange={handleChange}
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-700">{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location *</label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        placeholder="e.g. Pune, Maharashtra"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Professional Details */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Organization / College Name *</label>
                                <div className="relative">
                                    <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        placeholder="e.g. IIT Bombay or Google"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Education Level *</label>
                                <select
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                                >
                                    <option value="">Select Education</option>
                                    <option value="btech">B.Tech / B.E.</option>
                                    <option value="mtech">M.Tech / M.E.</option>
                                    <option value="bca">BCA</option>
                                    <option value="mca">MCA</option>
                                    <option value="bsc">B.Sc</option>
                                    <option value="msc">M.Sc</option>
                                    <option value="mba">MBA</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">User Type *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: "college_student", label: "College Student" },
                                        { id: "professional", label: "Professional" },
                                        { id: "fresher", label: "Fresher" },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setFormData(prev => ({ ...prev, userType: type.id }))}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${formData.userType === type.id
                                                ? "bg-purple-50 border-purple-500 text-purple-700"
                                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Differently Abled? *</label>
                                <div className="flex gap-4">
                                    {["Yes", "No"].map((opt) => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="differentlyAbled"
                                                value={opt.toLowerCase()}
                                                checked={formData.differentlyAbled === opt.toLowerCase()}
                                                onChange={handleChange}
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: OTP Verification */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 text-2xl">
                                    <FiFileText />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Verify Email</h3>
                                <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                                    We've sent a verification code to <span className="font-semibold text-gray-900">{formData.email}</span>
                                </p>
                            </div>

                            <div className="w-full max-w-xs">
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Enter OTP</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                                    className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                    placeholder="000000"
                                />
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                    Please enter the 6-digit code sent to your email
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">Didn't receive code?</span>
                                {canResend ? (
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={sendingOtp}
                                        className="text-purple-600 font-semibold hover:underline disabled:opacity-50"
                                    >
                                        {sendingOtp ? "Sending..." : "Resend OTP"}
                                    </button>
                                ) : (
                                    <span className="text-purple-600 font-semibold">
                                        Resend in {String(Math.floor(otpTimer / 60)).padStart(2, '0')}:{String(otpTimer % 60).padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Resume Upload */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Upload Resume</h3>
                                <p className="text-sm text-gray-500">Upload your latest resume to apply</p>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">
                                        <FiUploadCloud />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">Click to upload or drag and drop</p>
                                        <p className="text-sm text-gray-500 mt-1">PDF, DOC up to 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {formData.resume && (
                                <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
                                            <FiFileText />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                {formData.resume.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                                        className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {step === 5 && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 text-5xl animate-bounce">
                                <FiCheck />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                Your application for <span className="font-semibold text-gray-900">{job?.title}</span> at <span className="font-semibold text-gray-900">{job?.company}</span> has been submitted successfully.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                            >
                                View My Applications
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer (Hide on success step) */}
                {step < 5 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${step === 1
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-8 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            {step === 4 ? "Submit Application" : "Next"} <FiChevronRight />
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
