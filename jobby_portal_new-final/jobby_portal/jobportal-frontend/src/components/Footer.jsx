import React from "react";
import { Link } from "react-router-dom";
import { FiTwitter, FiLinkedin, FiInstagram, FiFacebook, FiBriefcase } from "react-icons/fi";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white">
            {/* Subtle top border */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Main Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 lg:col-span-2">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                                <FiBriefcase className="text-lg" />
                            </div>
                            <span className="text-xl font-bold">Jobbe</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Find your dream job with Jobbe. Connecting talent with opportunity worldwide.
                        </p>
                    </div>

                    {/* Job Seekers */}
                    <div>
                        <h5 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Seekers</h5>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/jobs" className="text-gray-400 hover:text-white transition-colors">Browse Jobs</Link></li>
                            <li><Link to="/job-categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                            <li><Link to="/companies" className="text-gray-400 hover:text-white transition-colors">Companies</Link></li>
                            <li><Link to="/saved-jobs" className="text-gray-400 hover:text-white transition-colors">Saved Jobs</Link></li>
                        </ul>
                    </div>

                    {/* Employers */}
                    <div>
                        <h5 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Employers</h5>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/employer/post-job" className="text-gray-400 hover:text-white transition-colors">Post a Job</Link></li>
                            <li><Link to="/employer/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                            <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h5 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h5>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Copyright */}
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Jobbe. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {[
                            { icon: FiTwitter, href: "#", label: "Twitter" },
                            { icon: FiLinkedin, href: "#", label: "LinkedIn" },
                            { icon: FiInstagram, href: "#", label: "Instagram" },
                            { icon: FiFacebook, href: "#", label: "Facebook" },
                        ].map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                aria-label={social.label}
                                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                                <social.icon className="text-base" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
