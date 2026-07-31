import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    httpOnly: true, // Prevent XSS attacks
    sameSite: isProduction ? "none" : "lax", // Allows cross-domain cookie sending between Vercel & Render in production
    secure: isProduction, // HTTPS required for sameSite: "none"
  });

  return token;
};