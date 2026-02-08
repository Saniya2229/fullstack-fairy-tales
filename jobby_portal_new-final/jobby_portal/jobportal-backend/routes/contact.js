import { Router } from "express";
import {
    contactCompany,
    getAllContactMessages,
    getCompanyContactMessages,
    updateContactStatus
} from "../controllers/contactController.js";

const router = Router();

// Submit contact form
router.post("/", contactCompany);

// Get all contact messages (admin)
router.get("/", getAllContactMessages);

// Get messages for specific company
router.get("/company/:id", getCompanyContactMessages);

// Update message status
router.patch("/:id/status", updateContactStatus);

export default router;
