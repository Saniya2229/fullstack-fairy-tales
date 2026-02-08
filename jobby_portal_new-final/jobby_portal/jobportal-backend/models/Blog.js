// models/Blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        tags: {
            type: [String],
            default: [],
        },
        timeAgo: {
            type: String,
            default: "Just now",
        },
    },
    {
        timestamps: true,
    }
);

// Add index for faster queries
blogSchema.index({ featured: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
