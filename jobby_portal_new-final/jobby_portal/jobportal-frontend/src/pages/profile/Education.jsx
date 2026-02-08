import React, { useState, useEffect } from "react";
import { getMe, updateProfile } from "../../api/user";

export default function Education({ onNext }) {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    degree: "",
    institute: "",
    year: "",
    cgpa: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const user = await getMe();

        const edu = user.education?.current || {};

        setForm({
          degree: edu.degree || "",
          institute: edu.institute || "",
          year: edu.year || "",
          cgpa: edu.cgpa || "",
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSaveAndNext(e) {
    e.preventDefault();
    try {
      await updateProfile({
        education: {
          current: form,
        },
      });
      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      alert("Failed to save education");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSaveAndNext}>
      <h2 className="text-2xl font-semibold mb-4">
        Current / Recent Education
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="degree"
          value={form.degree}
          onChange={handleChange}
          placeholder="Degree (e.g., B.Tech)"
          className="p-3 border rounded"
        />

        <input
          name="institute"
          value={form.institute}
          onChange={handleChange}
          placeholder="Institute Name"
          className="p-3 border rounded"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Passing Year"
          className="p-3 border rounded"
        />

        <input
          name="cgpa"
          value={form.cgpa}
          onChange={handleChange}
          placeholder="CGPA / Percentage"
          className="p-3 border rounded"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded"
        >
          Save and Proceed
        </button>
      </div>
    </form>
  );
}
