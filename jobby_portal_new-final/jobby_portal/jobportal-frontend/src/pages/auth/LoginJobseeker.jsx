// src/pages/auth/LoginJobseeker.jsx
import React, { useState } from "react";
import { login } from "../../api/auth";
import { setAuthToken } from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function LoginJobseeker() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({
        email: form.email,
        password: form.password,
        role: "jobseeker",
      });

      setAuthToken(res.token);
      localStorage.removeItem("profile_draft_v1");

      // Check if there's a redirect URL stored (e.g., from clicking Apply on a job)
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        nav(redirectUrl);
      } else {
        nav("/profile/steps");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back !"
      subtitle="Sign in to continue to Jobbe."
      image="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?w=740&t=st=1685465064~exp=1685465664~hmac=506f52d5e823528b6375005725d972c9d96646f9f688f90647ed897417e2d0c2"
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-purple-100">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-purple-100 hover:text-white">
            <input type="checkbox" className="rounded border-purple-400 text-purple-600 focus:ring-purple-500 bg-white/10" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-purple-100 hover:text-white hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full py-3.5 bg-white text-purple-700 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg shadow-purple-900/20 mt-4"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="text-center mt-6 text-purple-100 text-sm">
          Don't have an account ?{" "}
          <Link to="/auth/register/jobseeker" className="text-white font-bold hover:underline ml-1">
            Sign Up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
