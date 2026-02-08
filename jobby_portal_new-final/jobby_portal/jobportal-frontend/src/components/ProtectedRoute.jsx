// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { usePreventBackNavigation } from "../hooks/usePreventBackNavigation";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    return null;
  }
}

export default function ProtectedRoute({ children, allowedRole }) {
  // Prevent browser back button navigation
  usePreventBackNavigation();

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/auth/login/jobseeker" replace />;

  const decoded = decodeJwt(token);
  if (!decoded) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/auth/login/jobseeker" replace />;
  }

  if (decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/auth/login/jobseeker" replace />;
  }

  if (allowedRole && decoded.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
