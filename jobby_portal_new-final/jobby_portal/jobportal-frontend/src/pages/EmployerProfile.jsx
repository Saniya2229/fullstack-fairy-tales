import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TopBanner from "../components/TopBanner";
import { motion } from "framer-motion";
import { FiCamera, FiEdit2, FiCheck, FiX, FiArrowLeft } from "react-icons/fi";
import { getEmployerProfile, updateEmployerProfile } from "../api/employer";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

export default function EmployerProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState({
    companyName: "",
    size: "",
    industry: "",
    website: "",
    address: "",
    founded: "",
    about: "",
    phone: ""
  });

  const [logoFile, setLogoFile] = useState(null);
  const logoInputRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getEmployerProfile();
      setCompany({
        companyName: data.companyName || "",
        size: data.companySize || "",
        industry: data.industry || "",
        website: data.website || "",
        address: data.address || "",
        founded: data.foundedYear || "",
        about: data.about || "",
        phone: data.phone || ""
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      await updateEmployerProfile(company);
      setIsSaved(true);
      setIsEditing(false);
      setTimeout(() => setIsSaved(false), 2200);
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Failed to save changes");
    }
  }

  function calculateCompanyScore() {
    let score = 0;
    const fields = [
      company.companyName,
      company.industry,
      company.size,
      company.website,
      company.address,
      company.founded,
      company.about,
      company.phone
    ];

    fields.forEach(field => {
      if (field && field.trim()) score += 12.5;
    });

    return Math.round(score);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader />
    </div>
  );

  const companyScore = calculateCompanyScore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      {/* Main content with proper top padding for fixed navbar */}
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/dashboard/employer")}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition mb-3 font-medium"
            >
              <FiArrowLeft /> Back to Dashboard
            </button>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Company Profile</h1>
              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded shadow hover:opacity-95 transition"
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-white border rounded shadow-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiX className="inline mr-1" /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded shadow hover:opacity-95 transition"
                    >
                      <FiCheck /> {isSaved ? "Saved!" : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Top banner */}
          <TopBanner height="h-32" />

          {/* Logo + Info */}
          <div className="relative -mt-12">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-lg bg-white p-1 shadow-lg flex items-center justify-center overflow-hidden">
                  {logoFile ? (
                    <img src={URL.createObjectURL(logoFile)} alt="logo" className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-purple-600 rounded">
                      {company.companyName?.[0] || "C"}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    title="Change company logo"
                    onClick={() => logoInputRef.current && logoInputRef.current.click()}
                    className="absolute -right-2 -bottom-2 bg-white p-2 rounded-full shadow border hover:scale-105 transition"
                  >
                    <FiCamera />
                  </button>
                )}

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
                />
              </div>

              <div className="bg-white/95 px-6 py-3 rounded-lg shadow min-w-[420px]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{company.companyName || "Company Name"}</h2>
                    <div className="text-sm text-gray-600 mt-1">
                      {company.industry || "Industry"} • {company.size || "Size"}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {company.website || "No website"}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-500">Company Score</div>
                    <div className="w-36 bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                        style={{ width: `${companyScore}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{companyScore}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6 mt-14">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Company Information */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Company Information</h3>
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={company.companyName}
                      onChange={(e) => setCompany((p) => ({ ...p, companyName: e.target.value }))}
                      placeholder="Company name"
                    />
                    <input
                      className="p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={company.website}
                      onChange={(e) => setCompany((p) => ({ ...p, website: e.target.value }))}
                      placeholder="Website"
                    />
                    <input
                      className="p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={company.industry}
                      onChange={(e) => setCompany((p) => ({ ...p, industry: e.target.value }))}
                      placeholder="Industry"
                    />
                    <input
                      className="p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={company.size}
                      onChange={(e) => setCompany((p) => ({ ...p, size: e.target.value }))}
                      placeholder="Company size"
                    />
                    <input
                      className="p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={company.address}
                      onChange={(e) => setCompany((p) => ({ ...p, address: e.target.value }))}
                      placeholder="Location"
                    />
                    <input
                      className="p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={company.founded}
                      onChange={(e) => setCompany((p) => ({ ...p, founded: e.target.value }))}
                      placeholder="Founded year"
                    />
                    <input
                      className="p-3 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent col-span-2"
                      value={company.phone}
                      onChange={(e) => setCompany((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Company Name" value={company.companyName} />
                    <InfoField label="Website" value={company.website} link />
                    <InfoField label="Industry" value={company.industry} />
                    <InfoField label="Company Size" value={company.size} />
                    <InfoField label="Location" value={company.address} />
                    <InfoField label="Founded" value={company.founded} />
                    <InfoField label="Phone" value={company.phone} className="col-span-2" />
                  </div>
                )}
              </motion.div>

              {/* About Company */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold mb-4">About Company</h3>
                {isEditing ? (
                  <textarea
                    className="w-full p-3 border rounded h-36 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={company.about}
                    onChange={(e) => setCompany((p) => ({ ...p, about: e.target.value }))}
                    placeholder="Describe your company..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {company.about || "No description added yet."}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h4 className="text-md font-semibold mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <StatItem label="Profile Completeness" value={`${companyScore}%`} />
                  <StatItem label="Industry" value={company.industry || "Not set"} />
                  <StatItem label="Team Size" value={company.size || "Not set"} />
                  <StatItem label="Location" value={company.address || "Not set"} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h4 className="text-md font-semibold mb-3">Hiring Tips</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Keep job descriptions clear and specific</li>
                  <li>• Respond quickly to applicants</li>
                  <li>• Highlight company culture and benefits</li>
                  <li>• Use relevant industry tags</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function InfoField({ label, value, link, className = "" }) {
  return (
    <div className={className}>
      <div className="text-xs text-gray-500 uppercase font-semibold mb-1">{label}</div>
      {link && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
          {value}
        </a>
      ) : (
        <div className="font-medium text-gray-900">{value || "Not provided"}</div>
      )}
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
