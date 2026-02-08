import React from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiCheckCircle, FiBriefcase, FiUsers } from "react-icons/fi";

// Spring physics configuration for natural, bouncy animations
const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 25,
};

const springBouncy = {
    type: "spring",
    stiffness: 300,
    damping: 20,
};

const HeroSection = ({ keyword, setKeyword, location, setLocation, category, setCategory, handleSearch }) => {
    return (
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden mesh-gradient-animated">
            {/* Enhanced Animated Blobs with better blur */}
            <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-[100px] animate-float -z-10" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/15 rounded-full blur-[120px] animate-floatDelay -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-300/10 rounded-full blur-[150px] -z-10" />

            <div className="container-custom grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springBouncy, delay: 0.1 }}
                    className="relative z-10"
                >
                    {/* Status Badge with Premium Glass */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springTransition, delay: 0.3 }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass-premium text-slate-600 text-sm font-semibold mb-8"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse ring-4 ring-purple-100/50" />
                        #1 Job Platform for Professionals
                    </motion.div>

                    <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-slate-900 tracking-tight">
                        Discover your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 relative">
                            next big move
                            <svg className="absolute w-full h-3 bottom-1 left-0 text-purple-200/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
                        Connect with forward-thinking companies and find opportunities that match your ambition.
                    </p>

                    {/* Premium Search Bar with Glass Effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springBouncy, delay: 0.4 }}
                        className="glass-premium p-2.5 rounded-full flex flex-col md:flex-row items-center max-w-4xl relative z-20 glow-border"
                    >
                        {/* Keyword Input */}
                        <div className="flex-1 relative w-full md:w-auto group border-b md:border-b-0 border-white/20 md:border-none">
                            <FiBriefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors text-lg" />
                            <input
                                type="text"
                                placeholder="Job, company, title..."
                                className="w-full pl-14 pr-4 py-4 rounded-full bg-transparent focus:bg-transparent border-none focus:ring-0 text-gray-700 placeholder:text-gray-400 font-medium focus:outline-none"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-slate-200/50 mx-2"></div>

                        {/* Location Input */}
                        <div className="flex-1 relative w-full md:w-auto group border-b md:border-b-0 border-white/20 md:border-none">
                            <FiMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors text-lg" />
                            <input
                                type="text"
                                placeholder="City, Zip, or Remote"
                                className="w-full pl-14 pr-4 py-4 rounded-full bg-transparent focus:bg-transparent border-none focus:ring-0 text-gray-700 placeholder:text-gray-400 font-medium focus:outline-none"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-slate-200/50 mx-2"></div>

                        {/* Category Dropdown */}
                        <div className="flex-1 relative w-full md:w-auto group">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors text-lg" />
                            <select
                                className="w-full pl-14 pr-10 py-4 rounded-full bg-transparent focus:bg-transparent border-none focus:ring-0 text-gray-700 font-medium appearance-none cursor-pointer focus:outline-none"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                <option value="Design">Design</option>
                                <option value="Development">Development</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Sales">Sales</option>
                                <option value="Engineering">Engineering</option>
                                <option value="HR">HR</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Search Button with Spring Animation */}
                        <motion.button
                            onClick={handleSearch}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            transition={springTransition}
                            className="w-full md:w-auto p-4 md:py-3.5 md:px-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-full transition-all shadow-lg shadow-purple-300/40 mx-2 my-2 md:my-0 md:ml-4"
                        >
                            Find Job
                        </motion.button>
                    </motion.div>

                    {/* Stats with Spring Hover */}
                    <div className="mt-10 flex flex-wrap items-center gap-8 text-sm font-semibold text-slate-500">
                        {[
                            { icon: FiCheckCircle, color: "green", bg: "green", text: "15k+ Active Jobs" },
                            { icon: FiBriefcase, color: "blue", bg: "blue", text: "Verified Companies" },
                            { icon: FiUsers, color: "orange", bg: "orange", text: "Daily New Hires" },
                        ].map((stat, idx) => (
                            <motion.span
                                key={idx}
                                whileHover={{ scale: 1.05, y: -2 }}
                                transition={springTransition}
                                className="flex items-center gap-2 cursor-default"
                            >
                                <div className={`p-1.5 bg-${stat.bg}-100 rounded-full text-${stat.color}-600`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                {stat.text}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Right Graphic with Premium Glass */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ ...springBouncy, delay: 0.3 }}
                    className="relative hidden lg:block max-w-[70%] mx-auto"
                >
                    <motion.div
                        whileHover={{ rotate: 0 }}
                        initial={{ rotate: 2 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="relative z-10 glass-premium p-4 rounded-3xl"
                    >
                        <img
                            src="/brain/job_search_illustration_1765298288600.png"
                            alt="Professional Career Growth"
                            className="w-full h-auto rounded-2xl"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                            }}
                        />

                        {/* Floating Badge - Success */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...springBouncy, delay: 0.6 }}
                            className="absolute -top-6 -right-6 glass-premium p-4 rounded-2xl animate-float flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg shadow-green-200/50">
                                <FiCheckCircle />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Job Offer</div>
                                <div className="text-slate-900 font-bold">Successfully Hired</div>
                            </div>
                        </motion.div>

                        {/* Floating Badge - Companies */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...springBouncy, delay: 0.8 }}
                            className="absolute -bottom-8 -left-8 glass-premium p-4 rounded-2xl animate-floatDelay flex items-center gap-3"
                        >
                            <div className="flex -space-x-2">
                                {[
                                    { name: "Google", logo: "https://www.google.com/favicon.ico" },
                                    { name: "Amazon", logo: "https://www.amazon.com/favicon.ico" },
                                    { name: "Spotify", logo: "https://open.spotify.com/favicon.ico" },
                                ].map((company, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden flex items-center justify-center"
                                    >
                                        <img
                                            src={company.logo}
                                            alt={company.name}
                                            className="w-5 h-5 object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=8b5cf6&color=fff&size=32`;
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-bold text-slate-600">
                                500+ New Companies
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
