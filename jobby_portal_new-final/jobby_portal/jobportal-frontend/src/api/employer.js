// src/api/employer.js
import api from "./api";

export const getEmployerProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateEmployerProfile = async (data) => {
  const res = await api.put("/users/me", data);
  return res.data;
};

export const getMyJobs = async () => {
  const res = await api.get("/jobs/my-jobs");
  return res.data;
};

export const deleteJob = async (jobId) => {
  const res = await api.delete(`/jobs/${jobId}`);
  return res.data;
};
