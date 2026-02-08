import React, { useEffect, useState } from "react";
import { updateProfile } from "../../api/user";
import { FiBook, FiAward } from "react-icons/fi";

export default function PreviousEducation({
  value = {},
  onChange,
  onNext,
  onPrev,
}) {
  const [form, setForm] = useState({
    previousEducation_10_school: "",
    previousEducation_10_marks: "",
    previousEducation_12_school: "",
    previousEducation_12_marks: "",
    isDiploma: false,
    ...value,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm((p) => ({ ...p, ...value }));
  }, [value]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" || type === "radio" ? (name === "eduType" ? (value === "diploma") : checked) : value;

    if (name === "eduType") {
      const isDiploma = value === "diploma";
      setForm(p => ({ ...p, isDiploma }));
      onChange?.({ name: "isDiploma", value: isDiploma });
      return;
    }

    setForm((p) => ({ ...p, [name]: val }));
    onChange?.({ target: { name, value: val } });
  }

  async function handleSaveNext(e) {
    e.preventDefault();
    setSaving(true);
    try {
      onNext?.();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
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
          <h2 className="text-xl font-bold text-gray-900">Previous Education</h2>
          <p className="text-sm text-gray-500">Your schooling background</p>
        </div>
      </div>

      {/* 10th Details */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FiAward className="text-purple-600" />
          Class 10th Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>School Name</label>
            <input
              name="previousEducation_10_school"
              value={form.previousEducation_10_school || ""}
              onChange={handleChange}
              placeholder="e.g., Delhi Public School"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Marks / Percentage</label>
            <input
              name="previousEducation_10_marks"
              value={form.previousEducation_10_marks || ""}
              onChange={handleChange}
              placeholder="e.g., 92% or 9.2 CGPA"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* 12th / Diploma Toggle */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-semibold text-gray-800">Education Type:</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="eduType"
                value="12th"
                checked={!form.isDiploma}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className={`text-sm font-medium ${!form.isDiploma ? 'text-purple-700' : 'text-gray-600'}`}>
                12th Grade
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="eduType"
                value="diploma"
                checked={!!form.isDiploma}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className={`text-sm font-medium ${form.isDiploma ? 'text-purple-700' : 'text-gray-600'}`}>
                Diploma
              </span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {form.isDiploma ? "Diploma Institute" : "School / Junior College"}
            </label>
            <input
              name="previousEducation_12_school"
              value={form.previousEducation_12_school || ""}
              onChange={handleChange}
              placeholder={form.isDiploma ? "e.g., Government Polytechnic" : "e.g., Delhi Public School"}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Marks / Percentage</label>
            <input
              name="previousEducation_12_marks"
              value={form.previousEducation_12_marks || ""}
              onChange={handleChange}
              placeholder={form.isDiploma ? "e.g., 85% or 8.5 CGPA" : "e.g., 88%"}
              className={inputClass}
            />
          </div>
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
          {saving ? "Saving..." : "Save and Proceed →"}
        </button>
      </div>
    </form>
  );
}
