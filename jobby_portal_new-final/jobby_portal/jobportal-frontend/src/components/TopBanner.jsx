import React from "react";

export default function TopBanner({ height = "h-20" }) {
  return (
    <div
      className={`
        w-full ${height} rounded-xl shadow-lg overflow-hidden
        bg-gradient-to-r from-[#1a1f36] via-[#20263f] to-[#1a2038]
        flex items-center justify-between px-6
      `}
    >
      {/* Left text */}
      <div className="text-white text-sm flex items-center gap-2">
        <span className="font-semibold">JobPortal 2025</span>
        <span className="opacity-70 hidden sm:block">
          · Professional Profiles & Career Tools
        </span>
      </div>

      {/* Right CTA */}
    </div>
  );
}
