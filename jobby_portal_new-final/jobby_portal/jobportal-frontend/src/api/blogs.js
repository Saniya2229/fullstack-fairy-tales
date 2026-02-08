// src/api/blogs.js
import api from "./api";

export const getAllBlogs = async (params = {}) => {
    const res = await api.get("/blogs", { params });
    return res.data;
};

export const getBlogById = async (id) => {
    const res = await api.get(`/blogs/${id}`);
    return res.data;
};

export const createBlog = async (data) => {
    const res = await api.post("/blogs", data);
    return res.data;
};

export const updateBlog = async (id, data) => {
    const res = await api.put(`/blogs/${id}`, data);
    return res.data;
};

export const deleteBlog = async (id) => {
    const res = await api.delete(`/blogs/${id}`);
    return res.data;
};
