// src/api/jobs.js
import api from "./api";

export const listJobs = () => api.get("/jobs");
export const createJob = (payload) => api.post("/jobs", payload);
export const getJob = (id) => api.get(`/jobs/${id}`);
export const updateJob = (id, payload) => api.put(`/jobs/${id}`, payload);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const getAppliedJobs = async () => {
  const res = await api.get("/jobs/applied");
  return res.data;
};

export const getJobCategories = async () => {
  const res = await api.get("/jobs/categories");
  return res.data;
};

export const getLatestJobs = async () => {
  const res = await api.get("/jobs/latest");
  return res.data;
};
