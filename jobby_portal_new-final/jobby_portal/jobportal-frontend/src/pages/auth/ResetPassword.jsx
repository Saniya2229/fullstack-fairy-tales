// src/pages/auth/ResetPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock password reset logic
        setSubmitted(true);
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Reset your password with Jobbe."
            image="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?w=740&t=st=1685465400~exp=1685466000~hmac=8e3c15c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0"
        >
            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4 text-sm">
                        <p className="font-bold">Enter your Email and instructions will be sent to you!</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-purple-100">Username/Email</label>
                        <input
                            type="email"
                            placeholder="Enter username or email"
                            className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="w-full py-3.5 bg-white text-purple-700 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg shadow-purple-900/20 mt-4"
                    >
                        Send Request
                    </button>

                    <div className="text-center mt-6 text-purple-100 text-sm">
                        Remembered It ?{" "}
                        <Link to="/auth/login/jobseeker" className="text-white font-bold hover:underline ml-1">
                            Go to Login
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="text-center">
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6">
                        <p className="font-bold">Check your email!</p>
                        <p className="text-sm mt-1">We've sent password reset instructions to {email}</p>
                    </div>
                    <Link to="/auth/login/jobseeker" className="text-white font-bold hover:underline">
                        Back to Login
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
}
