// src/components/AuthLayout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthLayout({ children, title, subtitle, image, reverse = false }) {
    return (
        <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]"
            >

                {/* Left Side (Illustration) - Hidden on mobile, shown on desktop */}
                {/* If reverse is true, this block moves to the right visually via order-last */}
                <div className={`hidden md:flex flex-1 bg-white items-center justify-center p-12 relative ${reverse ? 'order-last' : ''}`}>
                    <div className="absolute top-8 left-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">J</div>
                            <span className="text-xl font-bold text-gray-800 tracking-tight">Jobbe</span>
                        </Link>
                    </div>

                    <div className="relative z-10 w-full max-w-md">
                        <img
                            src={image || "https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?w=826&t=st=1685458645~exp=1685459245~hmac=6d6411550073541ad11566370724c30254725066e5f96953190558c7a6d71597"}
                            alt="Auth Illustration"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />
                </div>

                {/* Right Side (Form) */}
                <div className="flex-1 bg-purple-600 text-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                    {/* Background decoration for the form side */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 0 L100 0 L100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-md mx-auto w-full">
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-2">{title}</h2>
                            {subtitle && <p className="text-purple-200">{subtitle}</p>}
                        </div>

                        {children}
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
