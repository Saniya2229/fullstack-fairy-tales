// src/pages/companies/CompanyView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCompanyDetails } from "../../api/companies";
import { listJobs } from "../../api/jobs"; // To fetch jobs for this company
import {
    FiMapPin, FiGlobe, FiUsers, FiCalendar, FiPhone, FiMail,
    FiArrowLeft, FiBriefcase, FiFacebook, FiLinkedin, FiTwitter, FiInstagram
} from "react-icons/fi";

export default function CompanyView() {
    const { id } = useParams();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const data = await getCompanyDetails(id);

                // --- REAL DATA INJECTION START ---
                const COMPANY_DETAILS = {
                    "Netflix": {
                        founded: "1997",
                        employees: "12,800+",
                        location: "Los Gatos, CA",
                        website: "https://jobs.netflix.com",
                        description: "Netflix is the world's leading streaming entertainment service with over 200 million paid memberships in over 190 countries enjoying TV series, documentaries, and feature films across a wide variety of genres and languages. We offer a unique culture of Freedom and Responsibility, where we avoid rules and rely on high-performing people to do what's best for the business.",
                        gallery: [
                            "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=800&q=80", // Modern office
                            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"  // Collaboration
                        ],
                        social: { twitter: "https://twitter.com/netflix", linkedin: "https://linkedin.com/company/netflix", facebook: "https://facebook.com/netflix", instagram: "https://instagram.com/netflix" }
                    },
                    "Spotify": {
                        founded: "2006",
                        employees: "9,000+",
                        location: "New York, NY",
                        website: "https://www.lifeatspotify.com/",
                        description: "Spotify is a digital music, podcast, and video service that gives you access to millions of songs and other content from creators all over the world. Our mission is to unlock the potential of human creativity by giving a million creative artists the opportunity to live off their art and billions of fans the opportunity to enjoy and be inspired by it.",
                        gallery: [
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/spotifyjobs", linkedin: "https://linkedin.com/company/spotify", facebook: "https://facebook.com/Spotify", instagram: "https://instagram.com/lifeatspotify" }
                    },
                    "Slack": {
                        founded: "2009",
                        employees: "2,500+",
                        location: "San Francisco, CA",
                        website: "https://slack.com/careers",
                        description: "Slack is a new way to communicate with your team. It's faster, better organized, and more secure than email. We are on a mission to make your working life simpler, more pleasant, and more productive. Join us to build the future of work.",
                        gallery: [
                            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/slackhq", linkedin: "https://linkedin.com/company/slack", facebook: "https://facebook.com/slackhq", instagram: "https://instagram.com/slackhq" }
                    },
                    "Adobe": {
                        founded: "1982",
                        employees: "29,000+",
                        location: "San Jose, CA",
                        website: "https://www.adobe.com/careers.html",
                        description: "Adobe is the global leader in digital media and digital marketing solutions. Our tools and services allow our customers to create groundbreaking digital content, deploy it across media and devices, measure and optimize it over time, and achieve greater business success.",
                        gallery: [
                            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/adobecareers", linkedin: "https://linkedin.com/company/adobe", facebook: "https://facebook.com/adobe", instagram: "https://instagram.com/adobelife" }
                    },
                    "Microsoft": {
                        founded: "1975",
                        employees: "220,000+",
                        location: "Redmond, WA",
                        website: "https://careers.microsoft.com/",
                        description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Its mission is to empower every person and every organization on the planet to achieve more. We believe technology can and should be a force for good.",
                        gallery: [
                            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/microsoftjobs", linkedin: "https://linkedin.com/company/microsoft", facebook: "https://facebook.com/microsoft", instagram: "https://instagram.com/microsoftlife" }
                    },
                    "Airbnb": {
                        founded: "2008",
                        employees: "6,000+",
                        location: "San Francisco, CA",
                        website: "https://careers.airbnb.com/",
                        description: "Airbnb was born in 2007 when two Hosts welcomed three guests to their San Francisco home, and has since grown to 4 million Hosts who have welcomed more than 1 billion guest arrivals. Every day, Hosts offer unique stays and experiences that make it possible for guests to connect with communities in a more authentic way.",
                        gallery: [
                            "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/airbnb", linkedin: "https://linkedin.com/company/airbnb", facebook: "https://facebook.com/airbnb", instagram: "https://instagram.com/airbnb" }
                    },
                    "Google": {
                        founded: "1998",
                        employees: "180,000+",
                        location: "Mountain View, CA",
                        website: "https://careers.google.com/",
                        description: "Google's mission is to organize the world's information and make it universally accessible and useful. We create products and services for the people like Search, YouTube, Android, Chrome, and many others. Our culture is all about innovation, inclusion, and making a positive impact.",
                        gallery: [
                            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/lifeatgoogle", linkedin: "https://linkedin.com/company/google", facebook: "https://facebook.com/google", instagram: "https://instagram.com/lifeatgoogle" }
                    },
                    "Wipro": {
                        founded: "1945",
                        employees: "250,000+",
                        location: "Bengaluru, India",
                        website: "https://careers.wipro.com/",
                        description: "Wipro Limited is a leading technology services and consulting company focused on building innovative solutions that address clients' most complex digital transformation needs. We leverage our holistic portfolio of capabilities in consulting, design, engineering, operations, and emerging technologies to help clients realize their boldest ambitions.",
                        gallery: [
                            "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/wipro", linkedin: "https://linkedin.com/company/wipro", facebook: "https://facebook.com/wipro", instagram: "https://instagram.com/wipro" }
                    },
                    "Infosys": {
                        founded: "1981",
                        employees: "330,000+",
                        location: "Bengaluru, India",
                        website: "https://www.infosys.com/careers/",
                        description: "Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation. With over four decades of experience in managing the systems and workings of global enterprises, we expertly steer our clients through their digital journey.",
                        gallery: [
                            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/infosys", linkedin: "https://linkedin.com/company/infosys", facebook: "https://facebook.com/Infosys", instagram: "https://instagram.com/infosys" }
                    },
                    "Canva": { // Override for Amdocs
                        overrideName: "Amdocs Technology",
                        logo: "/companies/amdocs_logo.png",
                        founded: "1982",
                        employees: "30,000+",
                        location: "Pune, India",
                        website: "https://www.amdocs.com/careers",
                        description: "Amdocs is a leading software and services provider to communications and media companies of all sizes, accelerating the industry's dynamic and continuous digital transformation. With a rich set of innovative solutions, long-term business relationships with 350 communications and media providers, and technology and distribution ties to 600 content creators, Amdocs delivers business improvements to drive growth.",
                        gallery: [
                            "https://images.unsplash.com/photo-1549637642-90187f64f420?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1538582709238-0a503bd5ae04?auto=format&fit=crop&w=800&q=80"
                        ],
                        social: { twitter: "https://twitter.com/amdocs", linkedin: "https://linkedin.com/company/amdocs", facebook: "https://facebook.com/amdocs", instagram: "https://instagram.com/amdocs" }
                    }
                };

                const realData = COMPANY_DETAILS[data.companyName] || {};

                // Merge Data
                const enhancedData = {
                    ...data,
                    companyName: realData.overrideName || data.companyName,
                    companyLogo: realData.logo || data.companyLogo,
                    companyEstablishedDate: realData.founded ? new Date(realData.founded) : data.companyEstablishedDate,
                    companySize: realData.employees || data.companySize,
                    companyLocation: realData.location || data.companyLocation,
                    companyWebsite: realData.website || data.companyWebsite,
                    companyDescription: realData.description || data.companyDescription,
                    companyGallery: realData.gallery || data.companyGallery,
                    social: realData.social || {}
                };

                setCompany(enhancedData);
                // --- REAL DATA INJECTION END ---

                // Fetch jobs and filter by this company (mock logic since backend filter might not exist yet)
                const allJobs = await listJobs();
                const jobs = allJobs.data.filter(j => j.employer?._id === id || j.employer === id);
                setCompanyJobs(jobs);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        load();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
    );

    if (!company) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
            <button onClick={() => nav('/companies')} className="mt-4 text-purple-600 font-bold hover:underline">Back to Companies</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                <button onClick={() => nav(-1)} className="text-gray-500 hover:text-purple-600 flex items-center gap-2 mb-6 transition-colors font-medium">
                    <FiArrowLeft /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar (Left) */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200 overflow-hidden border border-purple-50">
                                {company.companyLogo ? (
                                    <img src={company.companyLogo} alt={company.companyName} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <span className="text-5xl text-purple-600 font-bold">{company.companyName?.charAt(0) || "C"}</span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{company.companyName}</h1>
                            <p className="text-gray-500 font-medium mb-6">Since {new Date(company.companyEstablishedDate || Date.now()).getFullYear()}</p>

                            <div className="flex justify-center gap-3 mb-8">
                                {company.social?.facebook && <SocialIcon icon={<FiFacebook />} href={company.social.facebook} />}
                                {company.social?.twitter && <SocialIcon icon={<FiTwitter />} href={company.social.twitter} />}
                                {company.social?.linkedin && <SocialIcon icon={<FiLinkedin />} href={company.social.linkedin} />}
                                {company.social?.instagram && <SocialIcon icon={<FiInstagram />} href={company.social.instagram} />}
                            </div>

                            <div className="space-y-4 text-left border-t border-gray-100 pt-6">
                                <InfoItem icon={<FiUsers />} label="Employees" value={company.companySize || "N/A"} />
                                <InfoItem icon={<FiMapPin />} label="Location" value={company.companyLocation || "N/A"} />
                                <InfoItem icon={<FiGlobe />} label="Website" value={company.companyWebsite || "N/A"} />
                            </div>

                            <Link
                                to={`/contact?companyId=${company._id}`}
                                className="w-full mt-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                            >
                                <FiPhone /> Contact Us
                            </Link>
                        </div>
                    </div>

                    {/* Main Content (Right) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About Company</h2>
                            <div className="prose prose-purple max-w-none text-gray-600 leading-relaxed">
                                {company.companyDescription || "No description available."}
                            </div>
                        </div>

                        {/* Gallery (Mock) */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Gallery</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {company.companyGallery?.length > 0 ? (
                                    company.companyGallery.map((img, index) => (
                                        <div key={index} className="h-48 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                                            <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt={`Gallery ${index + 1}`} />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="h-48 bg-gray-100 rounded-xl overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Office" />
                                        </div>
                                        <div className="h-48 bg-gray-100 rounded-xl overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Meeting" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Current Openings */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Current Openings</h2>
                            {companyJobs.length > 0 ? (
                                <div className="space-y-4">
                                    {companyJobs.map(job => (
                                        <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center overflow-hidden border border-purple-100">
                                                    {company.companyLogo ? (
                                                        <img src={company.companyLogo} alt={company.companyName} className="w-full h-full object-contain p-1" />
                                                    ) : (
                                                        <span className="text-purple-600 text-xl font-bold">{company.companyName?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                                                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                        <span className="flex items-center gap-1"><FiMapPin className="text-xs" /> {job.location}</span>
                                                        <span>•</span>
                                                        <span>{job.salaryRange}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">{job.jobType}</span>
                                                <Link to={`/jobs/${job._id}`} className="px-5 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors">
                                                    Apply Now »
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-500">
                                    No current openings.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialIcon({ icon, href }) {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all"
        >
            {icon}
        </a>
    );
}

function InfoItem({ icon, label, value }) {
    const isUrl = value?.toString().startsWith("http");

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-600">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            {isUrl ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 font-semibold hover:underline truncate max-w-[200px]"
                >
                    Visit Website
                </a>
            ) : (
                <span className="text-gray-900 font-semibold">{value}</span>
            )}
        </div>
    );
}
