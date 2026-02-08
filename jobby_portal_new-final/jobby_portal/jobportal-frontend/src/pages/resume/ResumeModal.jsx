// src/pages/resume/ResumeModal.jsx
import React, { useState } from "react";

export default function ResumeModal({ onClose }) {
  const [resumeName, setResumeName] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[70%] rounded shadow-xl p-8 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-6">Choose a Template</h2>

        <label className="block mb-2 font-medium">Name your Résumé *</label>
        <input
          value={resumeName}
          onChange={(e) => setResumeName(e.target.value)}
          placeholder="My Resume"
          className="w-full border p-3 rounded mb-6"
        />

        <label className="block mb-4 font-medium">Select a Template *</label>

        {/* TEMPLATE OPTIONS */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-3 border rounded cursor-pointer hover:shadow-lg">
            <img src="https://i.imgur.com/vXbpXnY.png" className="w-full" />
            <p className="mt-2 text-center font-medium">Blocks New</p>
          </div>

          <div className="p-3 border rounded cursor-pointer hover:shadow-lg">
            <img src="https://i.imgur.com/BOmQx7g.png" className="w-full" />
            <p className="mt-2 text-center font-medium">
              Standard Template New
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded hover:bg-gray-50"
          >
            Close
          </button>

          <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Start building my Résumé →
          </button>
        </div>
      </div>
    </div>
  );
}
