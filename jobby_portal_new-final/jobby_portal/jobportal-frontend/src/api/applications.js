// src/api/applications.js
import api from "./api";

export const getEmployerApplications = async () => {
    const res = await api.get("/applications");
    return res.data;
};

export const getMyApplications = async () => {
    const res = await api.get("/applications/my");
    return res.data;
};

export const updateApplicationStatus = async (id, status) => {
    const res = await api.put(`/applications/${id}`, { status });
    return res.data;
};

export const updateApplicationNotes = async (id, notes) => {
    const res = await api.put(`/applications/${id}`, { notes });
    return res.data;
};

export const updateApplicationRating = async (id, rating) => {
    const res = await api.put(`/applications/${id}`, { rating });
    return res.data;
};

// Combined update if needed
export const updateApplication = async (id, data) => {
    const res = await api.put(`/applications/${id}`, data);
    return res.data;
};

// Create a new application (apply for a job)
export const createApplication = async (jobId) => {
    const res = await api.post("/applications", { jobId });
    return res.data;
};

// Cancel/withdraw an application
export const cancelApplication = async (applicationId) => {
    console.log('cancelApplication called with ID:', applicationId);
    console.log('Current auth header:', api.defaults.headers.common['Authorization']);

    // Manually add token to ensure it's included
    const token = localStorage.getItem('token');
    const res = await api.delete(`/applications/${applicationId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};
