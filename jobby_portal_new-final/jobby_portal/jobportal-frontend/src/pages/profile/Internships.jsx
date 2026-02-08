import React, { useEffect, useState, useRef } from "react";
import { updateProfile } from "../../api/user";
import { FiBriefcase, FiPlus, FiTrash2 } from "react-icons/fi";

export default function Internships({ value = [], onChange, onNext, onPrev }) {
  const isInternalUpdate = useRef(false);
  const [list, setList] = useState(value || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (JSON.stringify(value) !== JSON.stringify(list)) {
      setList(value || []);
    }
  }, [value]);

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(list)) {
      isInternalUpdate.current = true;
      if (typeof onChange === "function") onChange(list);
    }
  }, [list]);

  function addInternship() {
    setList((p) => [...p, { company: "", role: "", duration: "", description: "" }]);
  }

  function removeInternship(idx) {
    setList((p) => p.filter((_, i) => i !== idx));
  }

  function updateField(idx, field, val) {
    setList((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ internships: list });
      if (onNext) onNext();
    } catch (err) {
      console.error("Save Internships failed:", err);
      alert("Failed to save Internships.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <FiBriefcase className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Internships & Work Experience</h2>
          <p className="text-sm text-gray-500">Add your work experience and internships</p>
        </div>
      </div>

      {/* Internships List */}
      {list.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <FiBriefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-2">No experience added yet</p>
          <p className="text-sm text-gray-400">Click the button below to add your first internship</p>
        </div>
      )}

      {list.map((item, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              Experience #{idx + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeInternship(idx)}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Name</label>
              <input
                value={item.company}
                onChange={(e) => updateField(idx, "company", e.target.value)}
                placeholder="e.g., Google, Microsoft"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Role / Position</label>
              <input
                value={item.role}
                onChange={(e) => updateField(idx, "role", e.target.value)}
                placeholder="e.g., Software Intern"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Duration</label>
                  <input
                    value={item.duration}
                    onChange={(e) => updateField(idx, "duration", e.target.value)}
                    placeholder="e.g., 3 months"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description & Responsibilities</label>
              <textarea
                value={item.description}
                onChange={(e) => updateField(idx, "description", e.target.value)}
                className={`${inputClass} h-20 resize-none`}
                placeholder="Describe your work and key achievements..."
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addInternship}
        className="w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 hover:border-purple-400 transition-all flex items-center justify-center gap-2"
      >
        <FiPlus className="w-5 h-5" />
        Add {list.length === 0 ? 'Experience' : 'Another Experience'}
      </button>

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
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save and Proceed →"}
        </button>
      </div>
    </form>
  );
}
