import React from "react";
import { updateProfile } from "../../api/user";
import { FiBook, FiCalendar, FiAward } from "react-icons/fi";

export default function CurrentEducation({
  value = {},
  onFieldChange,
  onNext,
  onPrev,
}) {
  const section = value || {};

  async function handleSaveNext(e) {
    e.preventDefault();
    try {
      await updateProfile({ currentEdu: section });
      onNext?.();
    } catch (err) {
      console.error("Failed to save current education", err);
      alert("Error saving current education");
    }
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSaveNext} className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <FiBook className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Current Education</h2>
          <p className="text-sm text-gray-500">Where are you studying or have studied?</p>
        </div>
      </div>

      {/* Degree & College */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            <FiAward className="inline w-4 h-4 mr-1" />
            Degree <span className="text-red-500">*</span>
          </label>
          <select
            name="degree"
            value={section.degree || ""}
            onChange={onFieldChange}
            className={inputClass}
            required
          >
            <option value="">Select Degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.E">B.E</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="B.Sc">B.Sc</option>
            <option value="M.Sc">M.Sc</option>
            <option value="B.Com">B.Com</option>
            <option value="M.Com">M.Com</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
            <option value="Diploma">Diploma</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>
            College / University <span className="text-red-500">*</span>
          </label>
          <input
            name="college"
            value={section.college || ""}
            onChange={onFieldChange}
            placeholder="e.g., IIT Mumbai"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* CGPA & Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>CGPA</label>
          <input
            name="cgpa"
            value={section.cgpa || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
                if (parseFloat(val) > 10) return;
                onFieldChange(e);
              }
            }}
            placeholder="e.g., 8.5"
            className={inputClass}
          />
          <p className="text-xs text-gray-500 mt-1">Scale of 10.0</p>
        </div>
        <div>
          <label className={labelClass}>
            <FiCalendar className="inline w-4 h-4 mr-1" />
            Passing Year
          </label>
          <select
            name="year"
            value={section.year || ""}
            onChange={onFieldChange}
            className={inputClass}
          >
            <option value="">Select Year</option>
            {Array.from({ length: 12 }, (_, i) => 2020 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
            {Array.from({ length: 10 }, (_, i) => 2019 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Save and Proceed →
        </button>
      </div>
    </form>
  );
}
