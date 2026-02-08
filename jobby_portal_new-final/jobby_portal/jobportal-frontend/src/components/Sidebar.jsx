// src/components/Sidebar.jsx
import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiBriefcase,
  FiClipboard,
  FiBell,
  FiLayers,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiChevronDown,
  FiCamera,
} from "react-icons/fi";
import api from "../api/api";
import { computeCompletion } from "../utils/profileDraft";

/**
 * Premium Sidebar (Option C)
 * - dark/soft background, rounded cards, icons, hover + active states
 * - uses uploaded file as small logo (change path if you move the file)
 */

const seekerItems = [
  { to: "/dashboard/seeker", label: "Dashboard", icon: <FiHome /> },
  { to: "/find-jobs", label: "Job Profiles", icon: <FiBriefcase /> },
  { to: "/profile/steps", label: "My Profile", icon: <FiUser /> },
  { to: "/interviews", label: "Interviews", icon: <FiClipboard /> },
  { to: "/assessments", label: "Assessments", icon: <FiLayers /> },
  { to: "/events", label: "Events", icon: <FiFileText /> },
  { to: "/resume", label: "Resume", icon: <FiFileText /> },
  { to: "/help", label: "Help", icon: <FiHelpCircle /> },
];

const employerItems = [
  { to: "/dashboard/employer", label: "Dashboard", icon: <FiHome /> },
  { to: "/dashboard/employer/applications", label: "Applications", icon: <FiUser /> },
  { to: "/my-jobs", label: "Manage Jobs", icon: <FiBriefcase /> },
  { to: "/jobs/create", label: "Post a Job", icon: <FiFileText /> },
  { to: "/profile/employer", label: "Company Profile", icon: <FiUser /> },
  { to: "/help", label: "Help", icon: <FiHelpCircle /> },
];

export default function Sidebar({ collapsed = false, user, completion, onProfileUpdate }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await api.post('/upload/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update user profile with new photo URL
      await api.put('/users/me', { profilePhoto: uploadRes.data.url });

      // Notify parent to refresh
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      console.error('Failed to upload profile photo:', err);
    } finally {
      setUploading(false);
    }
  };

  // Calculate completion from user data if not provided as prop
  const calculatedCompletion = completion !== undefined ? completion : (user ? computeCompletion(user) : 0);
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Guest User";
  const displayRole = user?.role === "employer" ? "Employer" : "Job Seeker";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="w-72 min-h-screen bg-white/90 border-r border-gray-100 shadow-sm sticky top-0 flex flex-col">
      <div className="px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          J
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-800">Jobby</div>
          <div className="text-xs text-gray-500">Job Portal</div>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg p-3 border border-gray-100 relative">
          {/* Profile mini card */}
          {/* Profile mini card with photo upload */}
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="relative group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-md">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.firstName?.[0]?.toUpperCase() || "U"}</span>
                )}
              </div>
              {/* Camera icon overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white hover:bg-purple-700 transition-colors shadow-sm"
                title="Upload photo"
              >
                {uploading ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiCamera className="w-3 h-3" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                className="hidden"
              />
            </div>
            <div className="overflow-hidden flex-1 text-left">
              <div className="text-sm font-semibold truncate" title={displayName}>{displayName}</div>
              <div className="text-xs text-gray-500">{displayRole}</div>
            </div>
          </div>

          {/* progress */}
          <div className="mt-3 px-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Profile completeness</span>
              <span>{calculatedCompletion}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${calculatedCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        {(user?.role === "employer" ? employerItems : seekerItems).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm hover:bg-purple-50 hover:text-purple-600 transition ${isActive
                ? "bg-purple-50 text-purple-700 font-semibold border-r-4 border-purple-600"
                : "text-gray-700"
              }`
            }
          >
            <span className="text-lg">{it.icon}</span>
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section with Home and Logout */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
        >
          <FiHome className="text-lg" /> Home
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>
    </aside >
  );
}
