import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { applySocketRateLimiting } from '../middleware/socketRateLimiter.js';

const app = express();
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, '') : '';

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.trim().replace(/\/$/, '');
  if (clientUrl && cleanOrigin === clientUrl) return true;
  if (cleanOrigin === 'http://localhost:5173' || cleanOrigin === 'http://localhost:3000') return true;
  if (cleanOrigin.endsWith('.vercel.app')) return true;
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

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on('connection', (socket) => {
  // Apply rate limiting middleware to prevent socket event flooding
  applySocketRateLimiting(socket);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };