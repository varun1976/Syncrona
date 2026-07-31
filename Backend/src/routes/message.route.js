import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import { userSearchLimiter, sendMessageLimiter, getMessagesLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/users", protectRoute, userSearchLimiter, getUsersForSidebar);
router.get("/:id", protectRoute, getMessagesLimiter, getMessages);
router.post("/send/:id", protectRoute, sendMessageLimiter, sendMessage);

export default router;