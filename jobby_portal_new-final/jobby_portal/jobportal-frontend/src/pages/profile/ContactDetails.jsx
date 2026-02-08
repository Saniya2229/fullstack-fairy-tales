import React from "react";
import { updateProfile } from "../../api/user";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ContactDetails({
  value = {},
  onFieldChange,
  onNext,
  onPrev,
}) {
  const section = value || {};

  async function handleSaveNext(e) {
    e.preventDefault();
    try {
      await updateProfile({ contact: section });
      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save contact details.");
    }
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSaveNext} className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <FiMail className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
          <p className="text-sm text-gray-500">How can we reach you?</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            <FiMail className="inline w-4 h-4 mr-1" />
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={section.email || ""}
            onChange={onFieldChange}
            placeholder="john.doe@email.com"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>
            <FiPhone className="inline w-4 h-4 mr-1" />
            Alternate Phone
          </label>
          <input
            name="alternatePhone"
            value={section.alternatePhone || ""}
            onChange={onFieldChange}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
      </div>

      {/* Location */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <FiMapPin className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Location</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City <span className="text-red-500">*</span></label>
            <input
              name="city"
              value={section.city || ""}
              onChange={onFieldChange}
              placeholder="Mumbai"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              name="state"
              value={section.state || ""}
              onChange={onFieldChange}
              placeholder="Maharashtra"
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
          Save and Proceed →
        </button>
      </div>
    </form>
  );
}
