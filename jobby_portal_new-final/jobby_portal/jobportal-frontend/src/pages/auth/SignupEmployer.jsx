// src/pages/auth/SignupEmployer.jsx
import React, { useState } from "react";
import { signup } from "../../api/auth";
import { setAuthToken } from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function SignupEmployer() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signup({
        ...form,
        role: "employer",
      });

      setAuthToken(res.token);
      nav("/dashboard/employer");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Register Company"
      subtitle="Create an employer account to post jobs."
      image="https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg?w=826&t=st=1685465300~exp=1685465900~hmac=8e3c15c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0a8a6a6c0"
      reverse={true}
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-purple-100">First Name</label>
            <input
              name="firstName"
              type="text"
              placeholder="Jane"
              className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-purple-100">Last Name</label>
            <input
              name="lastName"
              type="text"
              placeholder="Smith"
              className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-purple-100">Work Email</label>
          <input
            name="email"
            type="email"
            placeholder="hr@company.com"
            className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-purple-100">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-purple-100">
          <input type="checkbox" required className="rounded border-purple-400 text-purple-600 focus:ring-purple-500 bg-white/10" />
          <span>I agree to the <a href="#" className="underline hover:text-white">Terms and conditions</a></span>
        </div>

        <button
          disabled={loading}
          className="w-full py-3.5 bg-white text-purple-700 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg shadow-purple-900/20 mt-2"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="text-center mt-6 text-purple-100 text-sm">
          Already have an account ?{" "}
          <Link to="/auth/login/employer" className="text-white font-bold hover:underline ml-1">
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
