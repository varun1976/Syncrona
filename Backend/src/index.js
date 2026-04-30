import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js'
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {app,server} from './lib/socket.js';
import path from 'path';

dotenv.config();
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))
const PORT=process.env.PORT;
const __dirname = path.resolve();

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    console.log("file too large");
    return res.status(413).json({ message: 'Payload too large. Max size is 200KB.' });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: 'Internal server error' });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

server.listen(PORT,()=>{
    console.log("Server is running on port :"+PORT);
    connectDB();
})