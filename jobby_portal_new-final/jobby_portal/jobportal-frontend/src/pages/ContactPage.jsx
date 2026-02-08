import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCompanyDetails } from "../api/companies";
import api from '../api/api';
import { useEffect } from 'react';

export default function ContactPage() {
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (companyId) {
            getCompanyDetails(companyId).then(setCompany).catch(console.error);
        }
    }, [companyId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...formData, companyId };

        api.post('/contact', payload)
            .then(() => {
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', subject: '', message: '' });
                if (companyId) {
                    setTimeout(() => navigate(-1), 2000);
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error('Failed to send message.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pt-20">
            <div className="bg-purple-600 pb-20 pt-8 text-center text-white px-4 relative">
                {companyId && (
                    <div className="absolute top-8 left-4 md:left-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
                        >
                            <FiArrowLeft /> Back
                        </button>
                    </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
                    {company ? `Contact ${company.companyName}` : "Get in Touch"}
                </h1>
                <p className="text-purple-100 max-w-2xl mx-auto text-lg opacity-90 leading-relaxed px-4">
                    {company
                        ? `Start working with ${company.companyName}. We are here to provide everything you need.`
                        : "Have questions about our services? We're here to help you find your dream job."}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info Cards */}
                    <div className="space-y-4 lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shrink-0">
                                <FiMail />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                <p className="text-gray-500 text-sm mb-2">Our friendly team is here to help.</p>
                                <a href={`mailto:${company?.email || "support@jobbe.com"}`} className="text-blue-600 font-semibold hover:underline">
                                    {company?.email || "support@jobbe.com"}
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl shrink-0">
                                <FiMapPin />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                                <p className="text-gray-500 text-sm mb-2">Come say hello at our office HQ.</p>
                                <p className="text-gray-900 font-medium">
                                    {company?.companyLocation || "100 Smith Street, Collingwood VIC 3066 AU"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl shrink-0">
                                <FiPhone />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                                <p className="text-gray-500 text-sm mb-2">Mon-Fri from 8am to 5pm.</p>
                                <a href="tel:+1555000000" className="text-purple-600 font-semibold hover:underline">+1 (555) 000-0000</a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>

                            <div className="text-right">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                                >
                                    {loading ? 'Sending...' : (
                                        <>
                                            Send Message <FiSend />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
