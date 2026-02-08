// src/pages/companies/CompanyList.jsx
import React, { useEffect, useState } from "react";
import { getCompanies } from "../../api/companies";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiArrowLeft, FiUsers, FiBriefcase, FiStar, FiArrowRight, FiGlobe, FiTrendingUp, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

// Enhanced company data with job roles
const COMPANY_DATA = {
    "Google": {
        rating: 4.6,
        jobs: 32,
        industry: "Technology",
        size: "100,000+ employees",
        roles: ["Software Engineer", "Product Manager", "UX Designer"],
        benefits: ["Health Insurance", "Stock Options", "Remote Work"],
        featured: true
    },
    "Microsoft": {
        rating: 4.5,
        jobs: 28,
        industry: "Technology",
        size: "180,000+ employees",
        roles: ["Cloud Architect", "Data Scientist", "DevOps Engineer"],
        benefits: ["401k Match", "Education Benefits", "Wellness Programs"],
        featured: true
    },
    "Netflix": {
        rating: 4.3,
        jobs: 15,
        industry: "Entertainment",
        size: "10,000+ employees",
        roles: ["Content Strategist", "Senior Developer", "UI Designer"],
        benefits: ["Unlimited PTO", "Stock Options", "Remote Work"]
    },
    "Spotify": {
        rating: 4.2,
        jobs: 12,
        industry: "Music Tech",
        size: "5,000+ employees",
        roles: ["Backend Engineer", "Product Designer", "Data Analyst"],
        benefits: ["Music Allowance", "Flexible Hours", "Learning Budget"]
    },
    "Flipkart": {
        rating: 4.1,
        jobs: 24,
        industry: "E-commerce",
        size: "50,000+ employees",
        roles: ["Frontend Developer", "Supply Chain Manager", "ML Engineer"],
        benefits: ["Health Insurance", "Stock Options", "Performance Bonus"],
        featured: true
    },
    "Infosys": {
        rating: 3.9,
        jobs: 45,
        industry: "IT Services",
        size: "300,000+ employees",
        roles: ["Java Developer", "Business Analyst", "Project Manager"],
        benefits: ["Training Programs", "Global Opportunities", "Insurance"]
    },
    "Tata Consultancy Services": {
        rating: 3.8,
        jobs: 52,
        industry: "IT Services",
        size: "500,000+ employees",
        roles: ["Full Stack Developer", "System Analyst", "Cloud Engineer"],
        benefits: ["Job Security", "Learning Platform", "Health Benefits"]
    },
    "Adobe": {
        rating: 4.4,
        jobs: 18,
        industry: "Software",
        size: "25,000+ employees",
        roles: ["Creative Director", "Product Manager", "React Developer"],
        benefits: ["Creative Tools", "Stock Options", "Remote Work"]
    },
    "Zomato": {
        rating: 4.0,
        jobs: 16,
        industry: "Food Tech",
        size: "5,000+ employees",
        roles: ["Marketing Manager", "Growth Analyst", "iOS Developer"],
        benefits: ["Food Credits", "Flexible Hours", "Stock Options"]
    },
    "Paytm": {
        rating: 3.8,
        jobs: 20,
        industry: "Fintech",
        size: "10,000+ employees",
        roles: ["Payments Engineer", "Risk Analyst", "Product Designer"],
        benefits: ["ESOPs", "Health Insurance", "Learning Budget"]
    },
};

const INDUSTRIES = ["All", "Technology", "IT Services", "E-commerce", "Fintech", "Entertainment"];

export default function CompanyList() {
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("All");
    const nav = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await getCompanies();
                setCompanies(data);
                setFilteredCompanies(data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        load();
    }, []);

    useEffect(() => {
        let result = companies;
        if (searchTerm) {
            result = result.filter(c => c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (selectedIndustry !== "All") {
            result = result.filter(c => {
                const data = COMPANY_DATA[c.companyName];
                return data?.industry === selectedIndustry;
            });
        }
        setFilteredCompanies(result);
    }, [searchTerm, selectedIndustry, companies]);

    const featuredCompanies = filteredCompanies.filter(c => COMPANY_DATA[c.companyName]?.featured);
    const regularCompanies = filteredCompanies.filter(c => !COMPANY_DATA[c.companyName]?.featured);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans">
            <Navbar />
            <PageTransition>
                {/* Hero Section */}
                <section className="relative pt-32 pb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
                    <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-20 w-60 h-60 bg-cyan-300/20 rounded-full blur-[80px]" />

                    <div className="relative max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={springTransition}
                        >
                            <button onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-purple-600 font-medium mb-6 hover:gap-3 transition-all">
                                <FiArrowLeft /> Back
                            </button>

                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-200">
                                            <FiUsers />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-slate-900">{companies.length}+</div>
                                            <div className="text-sm text-slate-500">Companies Hiring</div>
                                        </div>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                                        Find Your Dream <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Company</span>
                                    </h1>
                                    <p className="text-lg text-slate-500 mb-8 max-w-md">
                                        Explore top companies, learn about their culture, and discover roles that match your skills.
                                    </p>

                                    {/* Search */}
                                    <div className="relative max-w-md">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                        <input
                                            type="text"
                                            placeholder="Search companies..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-lg shadow-slate-200/50 transition-all text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: FiBriefcase, label: "Open Positions", value: "500+", color: "from-purple-500 to-pink-500" },
                                        { icon: FiGlobe, label: "Countries", value: "25+", color: "from-blue-500 to-cyan-500" },
                                        { icon: FiTrendingUp, label: "Avg Salary Hike", value: "40%", color: "from-green-500 to-emerald-500" },
                                        { icon: FiAward, label: "Top Rated", value: "50+", color: "from-orange-500 to-amber-500" },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ ...springTransition, delay: 0.1 + i * 0.1 }}
                                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                                                <stat.icon />
                                            </div>
                                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                            <div className="text-sm text-slate-500">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Industry Filters */}
                <section className="py-6 px-6 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap gap-2">
                            {INDUSTRIES.map(industry => (
                                <button
                                    key={industry}
                                    onClick={() => setSelectedIndustry(industry)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedIndustry === industry
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                                        }`}
                                >
                                    {industry}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Companies */}
                {featuredCompanies.length > 0 && (
                    <section className="py-12 px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-2 mb-6">
                                <FiAward className="text-amber-500" />
                                <h2 className="text-xl font-bold text-slate-900">Featured Companies</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredCompanies.map((company, index) => (
                                    <CompanyCard key={company._id} company={company} index={index} featured />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* All Companies */}
                <section className="py-12 px-6 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">All Companies</h2>
                            <p className="text-slate-500 text-sm">
                                Showing <span className="font-semibold text-slate-700">{regularCompanies.length}</span> companies
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            <AnimatePresence>
                                {regularCompanies.map((company, index) => (
                                    <CompanyCard key={company._id} company={company} index={index} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredCompanies.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUsers className="text-3xl text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No companies found</h3>
                                <p className="text-slate-500">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </section>

                <Footer />
            </PageTransition>
        </div>
    );
}

// Enhanced Company Card
function CompanyCard({ company, index, featured }) {
    const data = COMPANY_DATA[company.companyName] || {};
    const rating = data.rating || (3.8 + Math.random() * 0.8).toFixed(1);
    const jobCount = data.jobs || Math.floor(5 + Math.random() * 20);
    const roles = data.roles || ["Software Engineer", "Designer"];
    const industry = data.industry || "Technology";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ...springTransition, delay: index * 0.03 }}
        >
            <Link to={`/companies/${company._id}`} className="group block h-full">
                <div className={`bg-white rounded-2xl p-6 border transition-all h-full flex flex-col ${featured
                    ? "border-indigo-100 shadow-lg shadow-indigo-100/50 hover:shadow-xl hover:shadow-indigo-200/50"
                    : "border-slate-100 hover:border-indigo-200 hover:shadow-lg"
                    }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform">
                            {company.companyLogo ? (
                                <img src={company.companyLogo} alt={company.companyName} className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-2xl text-indigo-600 font-bold">{company.companyName?.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                            <FiStar className="text-amber-500 fill-amber-500 text-xs" />
                            <span className="text-xs font-bold text-amber-600">{rating}</span>
                        </div>
                    </div>

                    {/* Company Info */}
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {company.companyName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                            <FiMapPin className="text-xs" /> {company.companyLocation || "Remote"}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{industry}</span>
                    </div>

                    {/* Job Roles */}
                    <div className="flex-1 mb-4">
                        <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Hiring For</div>
                        <div className="flex flex-wrap gap-1.5">
                            {roles.slice(0, 3).map(role => (
                                <span key={role} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-lg font-medium">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-slate-600">
                            <FiBriefcase className="text-indigo-500" />
                            <span className="text-sm font-semibold">{jobCount}</span>
                            <span className="text-sm text-slate-400">open roles</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <FiArrowRight className="text-sm" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
