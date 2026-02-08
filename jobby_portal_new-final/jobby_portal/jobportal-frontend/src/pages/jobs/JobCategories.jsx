import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobCategories } from "../../api/jobs";
import { FiArrowLeft } from "react-icons/fi";
import Loader from "../../components/Loader";

// Full Reference List from Screenshot/Theme
const REFERENCE_CATEGORIES = [
    { name: "Accounting & Finance", count: 25 },
    { name: "Bank Jobs", count: 10 },
    { name: "Data Entry Job", count: 71 },
    { name: "Purchasing Manager", count: 40 },
    { name: "Project Manager", count: 86 },
    { name: "Education & training", count: 47 },
    { name: "Marketing & Advertising", count: 47 },
    { name: "Catering & Tourism", count: 47 },
    { name: "Government Jobs", count: 120 },
    { name: "Defence Jobs", count: 73 },
    { name: "Teaching Jobs", count: 88 },
    { name: "Retail & Customer Services", count: 10 },
    { name: "Diploma Jobs", count: 55 },
    { name: "Health Care Jobs", count: 99 },
    { name: "Manufacturing & production", count: 27 },
    { name: "Performing arts & media", count: 11 },
    { name: "It / Software Jobs", count: 175 },
    { name: "Logistics / Transportation", count: 60 },
    { name: "Sports Jobs", count: 42 },
    { name: "Forest Worker", count: 30 },
    { name: "Animal Care Worker", count: 120 },
    { name: "Digital Marketing", count: 88 },
    { name: "Administrative Officer", count: 0 },
    { name: "Garage services", count: 75 }
];

const JobCategories = () => {
    // Using reference data directly to match screenshot request
    const categories = REFERENCE_CATEGORIES;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold mb-3 uppercase tracking-wider">
                        Jobs Live Today
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Job By Categories</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Post a job to tell us about your project. We'll quickly match you with the right freelancers.
                    </p>
                </div>

                {/* Back Link */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                        <FiArrowLeft /> Back to Home
                    </Link>
                </div>

                {/* Categories Grid - 3 Columns */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, index) => (
                        <Link
                            key={index}
                            to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                            className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group"
                        >
                            <span className="text-gray-700 font-medium group-hover:text-purple-600 transition-colors">
                                {cat.name}
                            </span>
                            <span className="bg-purple-50 text-purple-600 text-xs font-bold px-2 py-1 rounded">
                                {cat.count}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobCategories;
