// controllers/blogController.js
import Blog from "../models/Blog.js";

// Get all blogs with optional filtering and pagination
export async function getAllBlogs(req, res) {
    try {
        const { featured, limit = 50, page = 1 } = req.query;

        const query = {};
        if (featured !== undefined) {
            query.featured = featured === "true";
        }

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (err) {
        console.error("Get blogs error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Get single blog by ID
export async function getBlogById(req, res) {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        res.json(blog);
    } catch (err) {
        console.error("Get blog by ID error:", err);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.status(500).json({ message: "Server error" });
    }
}

// Create new blog (for future admin functionality)
export async function createBlog(req, res) {
    try {
        const { title, author, content, excerpt, image, featured, tags } = req.body;

        if (!title || !author || !content || !image) {
            return res.status(400).json({
                message: "Title, author, content, and image are required"
            });
        }

        const blog = new Blog({
            title,
            author,
            content,
            excerpt,
            image,
            featured: featured || false,
            tags: tags || [],
        });

        await blog.save();

        res.status(201).json(blog);
    } catch (err) {
        console.error("Create blog error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Update blog (for future admin functionality)
export async function updateBlog(req, res) {
    try {
        const { id } = req.params;
        const { title, author, content, excerpt, image, featured, tags } = req.body;

        const blog = await Blog.findByIdAndUpdate(
            id,
            { title, author, content, excerpt, image, featured, tags },
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        res.json(blog);
    } catch (err) {
        console.error("Update blog error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Delete blog (for future admin functionality)
export async function deleteBlog(req, res) {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        res.json({ message: "Blog post deleted successfully" });
    } catch (err) {
        console.error("Delete blog error:", err);
        res.status(500).json({ message: "Server error" });
    }
}
