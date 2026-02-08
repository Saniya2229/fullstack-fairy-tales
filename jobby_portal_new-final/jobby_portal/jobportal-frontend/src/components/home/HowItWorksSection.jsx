import React from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiSearch, FiSend } from "react-icons/fi";

const HowItWorksSection = () => {
    const steps = [
        {
            step: "Step 1",
            title: "Register an account",
            subtitle: "Get Started",
            description: "Create your profile in seconds and unlock access to thousands of job opportunities tailored just for you.",
            icon: FiUserPlus,
            color: "from-pink-500 to-rose-500",
            badgeBg: "bg-gradient-to-r from-pink-500 to-rose-500",
            lightBg: "bg-pink-50",
            iconBg: "bg-pink-100",
            iconColor: "text-pink-600",
            dotColor: "bg-pink-500",
        },
        {
            step: "Step 2",
            title: "Find your job",
            subtitle: "Explore Opportunities",
            description: "Browse through curated job listings from top companies. Filter by location, salary, and experience level.",
            icon: FiSearch,
            color: "from-purple-500 to-indigo-500",
            badgeBg: "bg-gradient-to-r from-purple-500 to-indigo-500",
            lightBg: "bg-purple-50",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            dotColor: "bg-purple-500",
        },
        {
            step: "Step 3",
            title: "Apply for job",
            subtitle: "Land Your Dream Role",
            description: "Submit your application with one click. Track your progress and get notified when employers respond.",
            icon: FiSend,
            color: "from-cyan-500 to-blue-500",
            badgeBg: "bg-gradient-to-r from-cyan-500 to-blue-500",
            lightBg: "bg-cyan-50",
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600",
            dotColor: "bg-cyan-500",
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-slate-900">How It Works</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Get started in three simple steps and find your dream job today.
                    </p>
                </motion.div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Central Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

                    {/* Top Circle Marker */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow hidden md:block" />

                    {/* Timeline Items */}
                    <div className="space-y-12 md:space-y-0">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className={`relative md:flex md:items-center ${index !== steps.length - 1 ? "md:pb-20" : ""
                                        }`}
                                >
                                    {/* Desktop Layout */}
                                    <div className="hidden md:flex md:items-center md:w-full">
                                        {/* Left Side */}
                                        <div className={`w-5/12 ${isEven ? "pr-12 text-right" : "pr-12"}`}>
                                            {isEven ? (
                                                /* Icon Circle for Left Side */
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${step.lightBg} border-2 border-dashed border-gray-200`}
                                                >
                                                    <div className={`w-20 h-20 rounded-full ${step.iconBg} flex items-center justify-center`}>
                                                        <IconComponent className={`text-3xl ${step.iconColor}`} />
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                /* Card for Left Side */
                                                <motion.div
                                                    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left"
                                                >
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                        {step.title}
                                                        <span className={`ml-2 text-sm font-normal bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                                                            ({step.subtitle})
                                                        </span>
                                                    </h3>
                                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                                        {step.description}
                                                    </p>
                                                    <a href="#" className={`text-sm font-medium bg-gradient-to-r ${step.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}>
                                                        Learn more →
                                                    </a>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Center - Timeline Dot and Badge */}
                                        <div className="w-2/12 flex flex-col items-center relative z-10">
                                            {/* Badge */}
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className={`${step.badgeBg} text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg mb-4`}
                                            >
                                                {step.step}
                                            </motion.div>
                                            {/* Dot */}
                                            <div className={`w-3 h-3 rounded-full ${step.dotColor} ring-4 ring-white shadow`} />
                                        </div>

                                        {/* Right Side */}
                                        <div className={`w-5/12 ${isEven ? "pl-12" : "pl-12 text-left"}`}>
                                            {isEven ? (
                                                /* Card for Right Side */
                                                <motion.div
                                                    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                                                >
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                        {step.title}
                                                        <span className={`ml-2 text-sm font-normal bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                                                            ({step.subtitle})
                                                        </span>
                                                    </h3>
                                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                                        {step.description}
                                                    </p>
                                                    <a href="#" className={`text-sm font-medium bg-gradient-to-r ${step.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}>
                                                        Learn more →
                                                    </a>
                                                </motion.div>
                                            ) : (
                                                /* Icon Circle for Right Side */
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${step.lightBg} border-2 border-dashed border-gray-200`}
                                                >
                                                    <div className={`w-20 h-20 rounded-full ${step.iconBg} flex items-center justify-center`}>
                                                        <IconComponent className={`text-3xl ${step.iconColor}`} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Layout */}
                                    <div className="md:hidden">
                                        {/* Badge */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className={`${step.badgeBg} text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg inline-block mb-4`}
                                        >
                                            {step.step}
                                        </motion.div>

                                        {/* Card */}
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className={`w-14 h-14 rounded-full ${step.iconBg} flex items-center justify-center shrink-0`}>
                                                    <IconComponent className={`text-xl ${step.iconColor}`} />
                                                </div>
                                                {/* Content */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-slate-500 text-sm leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bottom Circle Marker */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow hidden md:block" />
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
