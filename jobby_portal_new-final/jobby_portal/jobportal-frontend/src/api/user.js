// src/api/user.js
import api from "./api";

// ================================
// GET logged-in user profile
// ================================
export async function getProfile() {
  const res = await api.get("/users/me");
  return res.data;
}

// Alias (optional, avoid breaking older code)
export const getMe = getProfile;

// ================================
// UPDATE user profile (Basic, Contact, Education, etc.)
// ================================
export async function updateProfile(payload) {
  // payload should already be FLATTENED (no nested objects)
  const res = await api.put("/users/me", payload);
  return res.data;
}

// ================================
// FINAL SUBMIT PROFILE
// ================================
export async function submitFullProfile(data) {
  const res = await api.post("/users/profile/submit", data);
  return res.data;
}

// ================================
// DOCUMENT UPLOAD (USED IN Documents.jsx)
// ================================
export async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await api.post("/upload/profile-photo", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // returns { url }
}

// ================================
// DASHBOARD INFO — Seeker Dashboard API
// ================================
export async function getDashboardInfo() {
  const res = await api.get("/users/dashboard");
  return res.data;
}

// ================================
// SAVED JOBS
// ================================
export async function toggleSavedJob(jobId) {
  const res = await api.post(`/users/saved-jobs/${jobId}`);
  return res.data;
}

export async function getSavedJobs() {
  const res = await api.get("/users/saved-jobs");
  return res.data;
}
