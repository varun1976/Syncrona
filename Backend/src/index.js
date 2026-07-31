import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { app, server } from './lib/socket.js';
import path from 'path';
import { globalLimiter } from './middleware/rateLimiter.js';

dotenv.config();

// Enable trust proxy for correct IP identification behind reverse proxies (Render, Cloudflare, etc.)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Gzip response compression
app.use(compression());

app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));
app.use(cookieParser());

// Dynamic CORS configuration allowing Vercel frontend (*.vercel.app) and local development
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, '') : '';

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Server-to-server or postman requests
  const cleanOrigin = origin.trim().replace(/\/$/, '');
  if (clientUrl && cleanOrigin === clientUrl) return true;
  if (cleanOrigin === 'http://localhost:5173' || cleanOrigin === 'http://localhost:3000') return true;
  if (cleanOrigin.endsWith('.vercel.app')) return true; // Automatically allow all Vercel deployments
  return false;
};

app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS REJECTED] Origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Apply global rate limiter to all API endpoints
app.use("/api", globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Payload limit error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload too large. Max size is 200KB.' });
  }

  console.error("Unhandled server error:", err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// Production static file fallback if frontend is built together
if (process.env.NODE_ENV === "production" && !process.env.CLIENT_URL) {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});