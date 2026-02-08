import React from "react";
import { updateProfile } from "../../api/user";
import { FiUser, FiCalendar, FiPhone, FiMapPin } from "react-icons/fi";

export default function BasicDetails({
  value = {},
  onFieldChange,
  onNext,
  onPrev,
}) {
  const section = value || {};

  async function handleSaveAndNext(e) {
    e.preventDefault();
    try {
      await updateProfile({ basic: section });
      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save basic details");
    }
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSaveAndNext} className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <FiUser className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Basic Details</h2>
          <p className="text-sm text-gray-500">Tell us about yourself</p>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
          <input
            name="firstName"
            value={section.firstName || ""}
            onChange={onFieldChange}
            placeholder="John"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Middle Name</label>
          <input
            name="middleName"
            value={section.middleName || ""}
            onChange={onFieldChange}
            placeholder="William"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input
            name="lastName"
            value={section.lastName || ""}
            onChange={onFieldChange}
            placeholder="Doe"
            className={inputClass}
          />
        </div>
      </div>

      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>
            <FiCalendar className="inline w-4 h-4 mr-1" />
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={section.dob || ""}
            onChange={onFieldChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Gender</label>
          <select
            name="gender"
            value={section.gender || ""}
            onChange={onFieldChange}
            className={inputClass}
          >
            <option value="">Select gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>
            <FiPhone className="inline w-4 h-4 mr-1" />
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            value={section.phone || ""}
            onChange={onFieldChange}
            placeholder="+91 98765 43210"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <FiMapPin className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Address Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Permanent Address</label>
            <textarea
              name="permanentAddress"
              value={section.permanentAddress || ""}
              onChange={onFieldChange}
              placeholder="Enter your permanent address..."
              className={`${inputClass} h-20 resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Current Address</label>
            <textarea
              name="currentAddress"
              value={section.currentAddress || ""}
              onChange={onFieldChange}
              placeholder="Enter your current address..."
              className={`${inputClass} h-20 resize-none`}
            />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                name="sameAsPermanent"
                checked={!!section.sameAsPermanent}
                onChange={(e) => {
                  onFieldChange(e);
                  if (e.target.checked) {
                    onFieldChange({
                      target: { name: "currentAddress", value: section.permanentAddress || "" }
                    });
                  }
                }}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Same as permanent address</span>
            </label>
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
            Back
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
