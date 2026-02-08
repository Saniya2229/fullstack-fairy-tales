// src/pages/resume/ResumeHome.jsx
import React, { useState } from "react";
import ResumeModal from "./ResumeModal";

export default function ResumeHome() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Resumes</h1>

        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Résumé
        </button>
      </div>

      {/* EMPTY STATE */}
      <div className="flex flex-col items-center justify-center mt-20">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          className="w-40 opacity-60"
        />

        <p className="mt-4 text-gray-600">
          You have not added any resumes yet.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="mt-6 px-6 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Create Resume
        </button>
      </div>

      {/* MODAL */}
      {open && <ResumeModal onClose={() => setOpen(false)} />}
    </div>
  );
}
