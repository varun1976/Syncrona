import express from "express";
import { submitContactForm } from "../controllers/support.controller.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/contact", contactLimiter, submitContactForm);

export default router;
