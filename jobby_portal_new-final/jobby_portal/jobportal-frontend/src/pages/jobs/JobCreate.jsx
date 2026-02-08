// src/pages/jobs/JobCreate.jsx
import React, { useState } from "react";
import { createJob } from "../../api/jobs";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiMapPin, FiDollarSign, FiAlignLeft, FiCheck, FiArrowLeft, FiZap } from "react-icons/fi";
import { generateJobDescription } from "../../api/ai";
import toast from "react-hot-toast";

export default function JobCreate() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salaryRange: "",
    jobType: "",
    qualifications: "",
    responsibilities: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        qualifications: form.qualifications.split("\n").filter(q => q.trim()),
        responsibilities: form.responsibilities.split("\n").filter(r => r.trim()),
      };
      await createJob(payload);
      nav("/my-jobs");
    } catch (err) {
      console.error(err);
      alert("Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  // AI Job Description Generator
  async function handleGenerateWithAI() {
    if (!form.title) {
      toast.error("Please enter a job title first");
      return;
    }

    setAiLoading(true);
    try {
      const result = await generateJobDescription({
        title: form.title,
        location: form.location,
        experience: form.salaryRange,
        skills: form.qualifications.split("\n").filter(q => q.trim()),
      });

      if (result.success && result.description) {
        const desc = result.description;
        setForm(prev => ({
          ...prev,
          description: desc.fullDescription || desc.summary || '',
          responsibilities: (desc.responsibilities || []).join('\n'),
          qualifications: (desc.requirements || []).join('\n'),
        }));
        toast.success("AI generated job description!");
      } else {
        toast.error("Failed to generate description");
      }
    } catch (err) {
      console.error("AI Generate error:", err);
      toast.error("Failed to generate description");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => nav("/dashboard/employer")}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition mb-4 font-medium"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Post a New Job</h2>
            <p className="text-purple-100 mt-1">Find the perfect candidate for your company</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="text-gray-400" />
                  </div>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={form.title}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-purple-500 focus:border-purple-500 p-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      name="location"
                      required
                      placeholder="e.g. Remote, New York"
                      value={form.location}
                      onChange={handleChange}
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-purple-500 focus:border-purple-500 p-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      name="salaryRange"
                      placeholder="e.g. $80k - $120k"
                      value={form.salaryRange}
                      onChange={handleChange}
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-purple-500 focus:border-purple-500 p-3"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-lg border focus:ring-purple-500 focus:border-purple-500 p-3"
                  >
                    <option value="">Select a category</option>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Sales">Sales</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    name="jobType"
                    required
                    value={form.jobType}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-lg border focus:ring-purple-500 focus:border-purple-500 p-3"
                  >
                    <option value="">Select job type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateWithAI}
                    disabled={aiLoading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-lg hover:shadow-lg transition disabled:opacity-50"
                  >
                    <FiZap className="w-3 h-3" />
                    {aiLoading ? "Generating..." : "Generate with AI"}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FiAlignLeft className="text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    required
                    placeholder="Describe the role, responsibilities, and requirements... Or click 'Generate with AI' to auto-generate!"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-purple-500 focus:border-purple-500 p-3"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Responsibilities</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FiCheck className="text-gray-400" />
                  </div>
                  <textarea
                    name="responsibilities"
                    required
                    placeholder="List responsibilities (one per line)..."
                    value={form.responsibilities}
                    onChange={handleChange}
                    rows={5}
                    className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-purple-500 focus:border-purple-500 p-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FiCheck className="text-gray-400" />
                  </div>
                  <textarea
                    name="qualifications"
                    required
                    placeholder="List qualifications (one per line)..."
                    value={form.qualifications}
                    onChange={handleChange}
                    rows={5}
                    className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-purple-500 focus:border-purple-500 p-3"
                  />
                </div>
              </div>
            </div>


            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => nav(-1)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? "Posting..." : <><FiCheck /> Post Job</>}
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
}
