import express from "express";
import { signup, login, logout, updateProfile, checkAuth, googleAuth, deleteAccount, changePassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { loginLimiter, signupLimiter } from "../middleware/authLimiter.js";
import { profileLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/google", loginLimiter, googleAuth);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, profileLimiter, updateProfile);
router.put("/change-password", protectRoute, profileLimiter, changePassword);
router.delete("/delete-account", protectRoute, profileLimiter, deleteAccount);
router.get("/check", protectRoute, checkAuth);

export default router;
