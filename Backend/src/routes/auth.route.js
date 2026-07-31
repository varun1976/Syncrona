import express from "express";
import { signup, login, logout, updateProfile, checkAuth, googleAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { loginLimiter, signupLimiter } from "../middleware/authLimiter.js";
import { profileLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/google", loginLimiter, googleAuth);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, profileLimiter, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
