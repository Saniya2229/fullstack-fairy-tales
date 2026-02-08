// server.js (ESM-Compatible)

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import resumeRoutes from "./routes/resumes.js";
import jobRoutes from "./routes/jobs.js";
import applicationRoutes from "./routes/applications.js";
import blogRoutes from "./routes/blogs.js";
import otpRoutes from "./routes/otp.js";
import contactRoutes from "./routes/contact.js";
import aiRoutes from "./routes/ai.js";

// ✅ Already correct Multer Middleware
import multerMiddleware from "./middleware/multerConfig.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

// STATIC FILE SERVING
const __dirname = process.cwd();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CONNECT MONGO
connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // ROUTES
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/resumes", resumeRoutes);
    app.use("/api/jobs", jobRoutes);
    app.use("/api/applications", applicationRoutes);
    app.use("/api/blogs", blogRoutes);
    app.use("/api/otp", otpRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/ai", aiRoutes);

    // ⭐ PROFILE PHOTO / DOCUMENT UPLOAD ROUTE (CORRECT)
    app.post(
      "/api/upload/profile-photo",
      multerMiddleware.single("file"),
      (req, res) => {
        if (!req.file)
          return res.status(400).json({ message: "No file uploaded" });
        const base =
          process.env.BASE_URL ||
          `http://localhost:${process.env.PORT || 5000}`;
        res.json({ url: `${base}/uploads/${req.file.filename}` });
      }
    );

    // SERVER START
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err);
  });
