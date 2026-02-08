import React, { useEffect, useState } from "react";
import { getJob, updateJob } from "../../api/jobs";
import { useParams, useNavigate } from "react-router-dom";

export default function JobEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const res = await getJob(id);
        const data = res.data;
        // Convert arrays to newline-separated strings for editing
        if (Array.isArray(data.qualifications)) data.qualifications = data.qualifications.join('\n');
        if (Array.isArray(data.responsibilities)) data.responsibilities = data.responsibilities.join('\n');
        setForm(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save(e) {
    e.preventDefault();
    try {
      const payload = { ...form };
      // Convert strings back to arrays
      if (typeof payload.qualifications === 'string') {
        payload.qualifications = payload.qualifications.split('\n').filter(x => x.trim());
      }
      if (typeof payload.responsibilities === 'string') {
        payload.responsibilities = payload.responsibilities.split('\n').filter(x => x.trim());
      }
      await updateJob(id, payload);
      nav("/jobs");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">Edit Job</h2>

      <form onSubmit={save} className="mt-6 grid gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="p-3 border rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="p-3 border rounded h-32"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="p-3 border rounded"
        />
        <input
          name="salaryRange"
          value={form.salaryRange}
          onChange={handleChange}
          className="p-3 border rounded"
        />

        <select
          name="jobType"
          value={form.jobType}
          onChange={handleChange}
          className="p-3 border rounded"
        >
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>

        <textarea
          name="responsibilities"
          placeholder="Responsibilities (one per line)"
          value={form.responsibilities || ""}
          onChange={handleChange}
          className="p-3 border rounded h-32"
        />

        <textarea
          name="qualifications"
          placeholder="Qualifications (one per line)"
          value={form.qualifications || ""}
          onChange={handleChange}
          className="p-3 border rounded h-32"
        />

        <button className="px-6 py-2 bg-purple-600 text-white rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
