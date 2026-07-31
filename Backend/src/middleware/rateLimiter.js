import rateLimit from "express-rate-limit";

// Centralized violation logging helper
export const logRateLimitViolation = (req, limitType) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "Unknown IP";
  const userId = req.user?._id ? req.user._id.toString() : "Unauthenticated";
  const endpoint = req.originalUrl || req.url;

  console.warn(
    `[RATE LIMIT VIOLATION] ${timestamp} | Limit: ${limitType} | IP: ${ip} | UserID: ${userId} | Endpoint: ${endpoint}`
  );
};

// Helper to create rate limiters with consistent standard JSON responses & logging
const createLimiter = ({
  windowMs,
  max,
  limitType,
  customMessage = "Too many requests. Please try again later.",
}) => {
  return rateLimit({
    windowMs: windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: max || parseInt(process.env.GENERAL_RATE_LIMIT || "100", 10),
    standardHeaders: true, // Return rate limit info in RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
    handler: (req, res, next, options) => {
      logRateLimitViolation(req, limitType);
      res.status(429).json({
        success: false,
        message: customMessage,
      });
    },
  });
};

// 1. General API Limiter (100 requests / 15 minutes by default)
export const globalLimiter = createLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.GENERAL_RATE_LIMIT || "100", 10),
  limitType: "GENERAL_API",
  customMessage: "Too many requests from this IP. Please try again after 15 minutes.",
});

// 2. Profile Update Limiter (20 requests / minute)
export const profileLimiter = createLimiter({
  windowMs: parseInt(process.env.PROFILE_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.PROFILE_RATE_LIMIT || "20", 10),
  limitType: "PROFILE_UPDATE",
  customMessage: "Too many profile update attempts. Please wait a minute before trying again.",
});

// 3. User Search Limiter (60 requests / minute)
export const userSearchLimiter = createLimiter({
  windowMs: parseInt(process.env.USERS_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.USERS_RATE_LIMIT || "60", 10),
  limitType: "USER_SEARCH",
  customMessage: "Too many search requests. Please slow down.",
});

// 4. Send Message Limiter (120 requests / minute)
export const sendMessageLimiter = createLimiter({
  windowMs: parseInt(process.env.MESSAGE_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.MESSAGE_RATE_LIMIT || "120", 10),
  limitType: "SEND_MESSAGE",
  customMessage: "Messaging rate limit exceeded. Please wait a moment before sending more messages.",
});

// 5. Get Messages Limiter (120 requests / minute)
export const getMessagesLimiter = createLimiter({
  windowMs: parseInt(process.env.MESSAGE_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.MESSAGE_RATE_LIMIT || "120", 10),
  limitType: "GET_MESSAGES",
  customMessage: "Too many message fetch requests. Please slow down.",
});
