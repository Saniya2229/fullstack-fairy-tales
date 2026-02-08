// src/layouts/DashboardLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopBanner from "../components/TopBanner"; // you already have this from earlier

export default function DashboardLayout({ children, bannerHeight = "h-20" }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          {/* Put TopBanner here for consistency across dashboard pages */}
          <TopBanner height={bannerHeight} />

          {/* Content area - push it down so the banner and overlap looks right */}
          <div className="mt-6">
            <div className="bg-transparent">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
