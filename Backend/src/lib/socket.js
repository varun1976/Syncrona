import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import jwt from 'jsonwebtoken';
import { applySocketRateLimiting } from '../middleware/socketRateLimiter.js';

const app = express();
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, '') : '';

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.trim().replace(/\/$/, '');
  if (clientUrl && cleanOrigin === clientUrl) return true;
  if (cleanOrigin === 'http://localhost:5173' || cleanOrigin === 'http://localhost:3000' || cleanOrigin === 'http://localhost:4173') return true;
  return false;
};

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket CORS rejected: " + origin));
      }
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Helper to extract JWT token from cookies or handshake auth/query
function parseTokenFromHandshake(req) {
  let token = null;

  // 1. Check handshake.auth.token
  if (req.auth && req.auth.token) {
    token = req.auth.token;
  }

  // 2. Check cookies
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split('=');
      if (name === 'jwt' && val) {
        token = val;
        break;
      }
    }
  }

  // 3. Check query parameter
  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }

  return token;
}

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  try {
    const token = parseTokenFromHandshake(socket.handshake);
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return next(new Error("Authentication error: Invalid token payload"));
    }

    socket.userId = decoded.userId.toString();
    next();
  } catch (err) {
    return next(new Error("Authentication error: Unauthorized socket connection"));
  }
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on('connection', (socket) => {
  // Apply rate limiting middleware to prevent socket event flooding
  applySocketRateLimiting(socket);

  const userId = socket.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };