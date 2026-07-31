import rateLimit from "express-rate-limit";
import { logRateLimitViolation } from "./rateLimiter.js";

// Helper to construct auth rate limiters
const createAuthLimiter = ({
  windowMs,
  max,
  limitType,
  customMessage,
}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      logRateLimitViolation(req, limitType);
      res.status(429).json({
        success: false,
        message: customMessage,
      });
    },
  });
};

// 1. Login Limiter (5 attempts / 15 minutes)
export const loginLimiter = createAuthLimiter({
  windowMs: parseInt(process.env.LOGIN_WINDOW_MS || "900000", 10), // 15 mins
  max: parseInt(process.env.LOGIN_RATE_LIMIT || "5", 10),
  limitType: "AUTH_LOGIN",
  customMessage: "Too many login attempts. Please try again after 15 minutes.",
});

// 2. Signup Limiter (5 requests / 1 hour)
export const signupLimiter = createAuthLimiter({
  windowMs: parseInt(process.env.REGISTER_WINDOW_MS || "3600000", 10), // 1 hour
  max: parseInt(process.env.REGISTER_RATE_LIMIT || "5", 10),
  limitType: "AUTH_REGISTER",
  customMessage: "Too many accounts created from this IP. Please try again after an hour.",
});

// 3. Password Reset Limiter (3 requests / 1 hour)
export const forgotPasswordLimiter = createAuthLimiter({
  windowMs: parseInt(process.env.FORGOT_PASSWORD_WINDOW_MS || "3600000", 10),
  max: parseInt(process.env.FORGOT_PASSWORD_RATE_LIMIT || "3", 10),
  limitType: "AUTH_FORGOT_PASSWORD",
  customMessage: "Too many password reset requests. Please try again after an hour.",
});

// 4. Resend Email Verification Limiter (3 requests / 1 hour)
export const resendVerificationLimiter = createAuthLimiter({
  windowMs: parseInt(process.env.RESEND_VERIFICATION_WINDOW_MS || "3600000", 10),
  max: parseInt(process.env.RESEND_VERIFICATION_RATE_LIMIT || "3", 10),
  limitType: "AUTH_RESEND_VERIFICATION",
  customMessage: "Too many verification email requests. Please try again after an hour.",
});
