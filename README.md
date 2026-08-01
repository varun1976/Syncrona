# QuickChat (Syncrona) 💬

A modern, production-grade, real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js), Socket.IO, Google OAuth, and Cloudinary.

Designed for high performance, security, and smooth cross-domain production deployment on **Vercel** (Frontend) and **Render** (Backend).

🌐 **Live Application**: [https://syncrona.vercel.app](https://syncrona.vercel.app)  
---


## ✨ Features

- 🔐 **Dual-Layer Authentication**:
  - Email/Password auth with hashed passwords (`bcryptjs`).
  - Google OAuth 2.0 integration via `@react-oauth/google` & `google-auth-library`.
  - Dual Token Strategy: HTTP-only cookies + `Authorization: Bearer <token>` header fallback for 100% reliability across cross-domain browsers (Safari, Chrome, Mobile).
- 💬 **Real-time Messaging**:
  - Instant direct messaging powered by **Socket.IO**.
  - Real-time online user status tracking.
  - Automatic reconnection handling and fallback transports (`websocket`, `polling`).
- 🛡️ **Production Security & Rate Limiting**:
  - **HTTP API Rate Limiting**: Configurable limiters for login, signup, user search, profile updates, and messaging (`express-rate-limit`).
  - **Socket.IO Packet Limiting**: Intercepts WebSocket event flooding and disconnects abusive clients automatically.
  - **Security Hardening**: **Helmet** security headers, **Gzip compression**, **CORS** origin filtering, payload limits, and `trust proxy` enabled.
- 🖼️ **Media & Profile Management**:
  - Profile image uploads hosted on **Cloudinary**.
  - Image attachments in chat messages.
- 🎨 **Modern Responsive UI**:
  - Built with **React 18**, **Vite**, **Tailwind CSS**, and **DaisyUI**.
  - Responsive layout optimized for mobile and desktop screens.
  - Interactive theme switching and toast notifications (`react-hot-toast`).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **State Management**: Zustand
- **Styling**: Tailwind CSS & DaisyUI
- **Authentication**: `@react-oauth/google` (Google Identity Services)
- **HTTP & Sockets**: Axios & `socket.io-client`
- **Icons & UI**: Lucide React & `react-hot-toast`

### Backend
- **Runtime**: Node.js (ESM) & Express
- **Database**: MongoDB Atlas & Mongoose
- **Real-time Engine**: Socket.IO
- **Security & Utilities**: `google-auth-library`, `jsonwebtoken`, `bcryptjs`, `express-rate-limit`, `helmet`, `compression`, `cors`
- **Storage**: Cloudinary SDK

---

## 📁 Project Structure

```text
QuickChat/
├── Backend/                  # Node.js + Express + Socket.IO Server
│   ├── src/
│   │   ├── controllers/      # Auth & Message route handlers
│   │   ├── lib/              # DB connection, Socket.IO, Cloudinary, JWT utils
│   │   ├── middleware/       # Auth middleware, HTTP & Socket rate limiters
│   │   ├── models/           # Mongoose schemas (User, Message)
│   │   └── routes/           # Auth & Message API endpoints
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── Frontend/                 # React SPA (Vite)
    ├── src/
    │   ├── components/       # Chat container, Sidebar, Navbar, Google Auth button
    │   ├── lib/              # Axios instance & Google OAuth setup
    │   ├── pages/            # Login, Signup, Profile, Home pages
    │   ├── store/            # Zustand auth & chat stores
    │   └── main.jsx
    ├── vercel.json           # SPA routing rewrite rule
    ├── .env.example          # Frontend environment template
    └── package.json
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster
- Cloudinary account
- Google Cloud Console OAuth 2.0 Client ID

### 1. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:
```env
CLIENT_URL=http://localhost:5173
PORT=5001
NODE_ENV=development

MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Rate Limiting Settings
RATE_LIMIT_WINDOW_MS=900000
GENERAL_RATE_LIMIT=100
LOGIN_WINDOW_MS=900000
LOGIN_RATE_LIMIT=5
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` folder:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Start the Vite development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Production Deployment Guide

### Backend Deployment (Render)
1. Create a **Web Service** on [Render](https://render.com/).
2. Root Directory: `Backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `CLIENT_URL`: `https://syncrona.vercel.app`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Your JWT Secret>`
   - `GOOGLE_CLIENT_ID`: `<Your Google OAuth Client ID>`
   - `CLOUDINARY_*`: `<Your Cloudinary Credentials>`

### Frontend Deployment (Vercel)
1. Import project into [Vercel](https://vercel.com/).
2. Framework Preset: `Vite`
3. Root Directory: `Frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: `https://syncrona-backend.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://syncrona-backend.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID`: `<Your Google OAuth Client ID>`

---

## 🔒 Security Best Practices Implemented

1. **Google ID Token Server Verification**: Google ID tokens are verified strictly on the backend using `OAuth2Client.verifyIdToken()`.
2. **Standardized Error Handling**: Meaningful 401 response messages (`Token missing`, `Token expired`, `Invalid token`, `User not found`).
3. **Cross-Domain Cookie Support**: Configured `sameSite: "none"` and `secure: true` in production with Bearer header fallback.
4. **Rate Limiting Protection**: Protects against brute-force login attempts and WebSocket event flooding.

---

## 📝 License
This project is licensed under the ISC License.
