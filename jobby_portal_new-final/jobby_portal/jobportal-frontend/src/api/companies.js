// src/api/companies.js
import api from "./api";

export const getCompanies = async () => {
    const res = await api.get("/users/employers");
    return res.data;
};

export const getCompanyDetails = async (id) => {
    const res = await api.get(`/users/employers/${id}`);
    return res.data;
};
