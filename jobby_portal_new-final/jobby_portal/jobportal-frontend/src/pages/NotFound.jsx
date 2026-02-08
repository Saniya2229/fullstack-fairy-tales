// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4 text-center font-sans">
            <div className="max-w-lg w-full">
                <img
                    src="https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg?w=996&t=st=1685465500~exp=1685466100~hmac=8e3c15c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0"
                    alt="404 Not Found"
                    className="w-full h-auto mb-8 mix-blend-multiply"
                />

                <h1 className="text-4xl font-bold text-gray-900 mb-4">SORRY, PAGE NOT FOUND</h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    It will be as simple as Occidental in fact, it will be Occidental
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                    <FiHome /> Back to Home
                </Link>
            </div>
        </div>
    );
}
