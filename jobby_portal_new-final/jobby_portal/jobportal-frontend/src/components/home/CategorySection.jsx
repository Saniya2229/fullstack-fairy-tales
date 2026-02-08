import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPenTool, FiCode, FiTrendingUp, FiPieChart, FiHeart, FiTarget, FiCpu, FiUsers } from "react-icons/fi";

// Spring physics
const springTransition = { type: "spring", stiffness: 400, damping: 25 };

// Category config with job roles
const categoryConfig = {
    Design: {
        icon: FiPenTool,
        gradient: "from-pink-500 to-rose-500",
        bg: "from-pink-50 to-rose-50",
        jobs: "47+",
        trending: true,
        roles: ["UI/UX Designer", "Product Designer", "Brand Designer"]
    },
    Development: {
        icon: FiCode,
        gradient: "from-purple-500 to-indigo-500",
        bg: "from-purple-50 to-indigo-50",
        jobs: "52+",
        trending: true,
        roles: ["Frontend Dev", "Backend Dev", "Full Stack"]
    },
    Marketing: {
        icon: FiTrendingUp,
        gradient: "from-orange-500 to-amber-500",
        bg: "from-orange-50 to-amber-50",
        jobs: "38+",
        roles: ["SEO Specialist", "Content Marketing", "Growth Lead"]
    },
    Finance: {
        icon: FiPieChart,
        gradient: "from-emerald-500 to-teal-500",
        bg: "from-emerald-50 to-teal-50",
        jobs: "35+",
        roles: ["Financial Analyst", "Accountant"]
    },
    Healthcare: {
        icon: FiHeart,
        gradient: "from-red-500 to-pink-500",
        bg: "from-red-50 to-pink-50",
        jobs: "41+",
        trending: true,
        roles: ["Data Analyst", "Clinical Research"]
    },
    Sales: {
        icon: FiTarget,
        gradient: "from-blue-500 to-cyan-500",
        bg: "from-blue-50 to-cyan-50",
        jobs: "44+",
        roles: ["Account Executive", "Sales Manager"]
    },
    Engineering: {
        icon: FiCpu,
        gradient: "from-violet-500 to-purple-500",
        bg: "from-violet-50 to-purple-50",
        jobs: "39+",
        roles: ["Mechanical Eng", "Electrical Eng", "Robotics"]
    },
    HR: {
        icon: FiUsers,
        gradient: "from-cyan-500 to-blue-500",
        bg: "from-cyan-50 to-blue-50",
        jobs: "36+",
        roles: ["Recruiter", "HR Manager"]
    },
};

const CategorySection = ({ categoryStats }) => {
    const navigate = useNavigate();

    const getJobCount = (cat) => {
        const stat = categoryStats?.find(s => s._id === cat);
        return stat ? `${stat.count}+` : categoryConfig[cat]?.jobs || "0+";
    };

    return (
        <section className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
                >
                    <div>
                        <h2 className="text-4xl font-bold mb-3 text-slate-900">Explore Categories</h2>
                        <p className="text-lg text-slate-500">Discover opportunities across industries.</p>
                    </div>
                    <Link to="/job-categories" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all">
                        View all <FiArrowRight />
                    </Link>
                </motion.div>

                {/* Pinterest Masonry Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{
                    gridTemplateRows: 'repeat(4, minmax(140px, auto))',
                    gridTemplateAreas: `
                        "design design development development"
                        "design design development development"
                        "marketing marketing finance sales"
                        "healthcare hr engineering engineering"
                    `
                }}>
                    {Object.entries(categoryConfig).map(([name, config]) => (
                        <CategoryCard
                            key={name}
                            name={name}
                            config={config}
                            jobCount={getJobCount(name)}
                            navigate={navigate}
                            style={{ gridArea: name.toLowerCase() }}
                            large={name === "Design" || name === "Development"}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Reusable Card Component
const CategoryCard = ({ name, config, jobCount, navigate, style, large }) => {
    const IconComponent = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={springTransition}
            onClick={() => navigate(`/jobs?category=${encodeURIComponent(name)}`)}
            style={style}
            className={`bg-gradient-to-br ${config.bg} rounded-3xl p-5 cursor-pointer group relative overflow-hidden border border-slate-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 flex flex-col`}
        >
            {/* Trending Badge */}
            {config.trending && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Trending
                </div>
            )}

            {/* Icon */}
            <motion.div
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={springTransition}
                className={`w-11 h-11 ${large ? 'md:w-14 md:h-14' : ''} rounded-xl flex items-center justify-center text-lg ${large ? 'md:text-xl' : ''} bg-gradient-to-br ${config.gradient} text-white shadow-lg shrink-0`}
            >
                <IconComponent />
            </motion.div>

            {/* Content */}
            <div className="mt-auto pt-3">
                {/* Job Role Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {config.roles.slice(0, large ? 3 : 2).map(role => (
                        <span key={role} className="px-2 py-0.5 bg-white/70 rounded-full text-xs font-medium text-slate-600">
                            {role}
                        </span>
                    ))}
                </div>

                <h3 className={`font-bold text-slate-900 ${large ? 'text-xl' : 'text-base'} mb-0.5 group-hover:text-purple-700 transition-colors`}>
                    {name}
                </h3>

                <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">
                        <span className={`font-bold text-slate-700 ${large ? 'text-lg' : ''}`}>{jobCount}</span> jobs
                    </span>
                    <FiArrowRight className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* Hover overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
        </motion.div>
    );
};

export default CategorySection;
