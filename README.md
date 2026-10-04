# Syncrona 💬

> **Syncrona** (formerly QuickChat) is a production-grade, real-time messaging web application built with the MERN stack (MongoDB, Express, React, Node.js), Socket.IO, Google OAuth 2.0, and Cloudinary.

Designed with a modern glassmorphic UI, instant in-memory conversation caching, production-hardened security, and optimized cross-domain deployment for **Vercel** (Frontend) and **Render** (Backend).

🌐 **Live Web Application**: [https://syncrona.vercel.app](https://syncrona.vercel.app)  
⚡ **Backend API Endpoint**: [https://syncrona-backend.onrender.com](https://syncrona-backend.onrender.com)

---

## ✨ Features & Architecture Highlights

### 🔐 Multi-Provider Authentication & Account Security
- **Email & Password Authentication**: Secure user registration, login, and password changes powered by `bcryptjs` (salt factor 10).
- **Google OAuth 2.0 Integration**: One-tap Google Sign-In with server-side token verification using `google-auth-library` (`OAuth2Client.verifyIdToken`).
- **Hybrid Token Management**: Standard HTTP-only JWT cookies combined with `Authorization: Bearer <token>` fallback headers for 100% reliability across cross-domain browsers (Safari, iOS WebKit, Chrome).
- **Account Management & Data Protection**: Profile picture customization, display name updates, password changes, and complete account deletion with automated Cloudinary asset cleanup.

### 💬 Real-Time Messaging & Instant Conversation Caching
- **Authenticated Socket.IO Engine**: Real-time bi-directional messaging with JWT-authenticated socket handshakes (`io.use` middleware).
- **Online Presence Tracking**: Real-time tracking and broadcasting of online contacts.
- **Zero-Latency In-Memory LRU Cache**: Client-side LRU conversation cache (`useChatStore`) enabling instant 0ms conversation switching.
- **Background Message Sync**: Cursor-based differential synchronization (`?since=<id>`) to automatically fetch missed messages upon reconnecting.
- **Optimistic UI Updates**: Immediate message rendering with progress bars for media uploads and automatic delivery reconciliation.

### 🛡️ Production Security & Rate Limiting
- **Strict Socket Authentication**: Handshake token verification preventing user impersonation and unauthorized room listeners.
- **Strict Origin CORS Policy**: Domain-isolated CORS configuration preventing arbitrary cross-origin requests.
- **NoSQL Injection Defenses**: Type-checked body parsing (`typeof` checks) preventing MongoDB query operator injection.
- **Granular API Rate Limiting**: Centralized rate limiters protecting `/api/auth/*`, `/api/messages/*`, `/api/support/*`, and WebSocket event rates.
- **Security HTTP Headers**: Hardened with **Helmet** (strict referrer policy, framing restrictions, MIME sniffing protection) and **Gzip compression**.
- **Media Upload Sanitization**: Base64 MIME validation (`data:image/*`), file size enforcement (10MB body cap), and Cloudinary format restrictions (`jpg`, `jpeg`, `png`, `webp`, `gif`).

### 🎧 Support & Legal Pages
- **Contact & Inquiry Ticketing**: Integrated support desk (`/api/support/contact`) with honeypot spam protection and ticket persistence in MongoDB.
- **Legal Compliance Pages**: Built-in Privacy Policy and Terms of Service layouts.
- **Neumorphic Notification System**: Built-in custom glassmorphic toast notification store (`useNotificationStore`).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite build tool)
- **State Management**: Zustand
- **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/vite`), DaisyUI 5, Lucide React
- **Authentication**: `@react-oauth/google`
- **HTTP & Sockets**: Axios (with Request Interceptors) & `socket.io-client`

### Backend
- **Runtime**: Node.js (ES Modules) & Express
- **Database**: MongoDB Atlas & Mongoose 8
- **Real-Time Engine**: Socket.IO 4
- **Security & Middleware**: `jsonwebtoken`, `bcryptjs`, `google-auth-library`, `express-rate-limit`, `helmet`, `compression`, `cors`
- **Media Storage**: Cloudinary v2 SDK

---

## 📁 Repository Structure

```text
QuickChat/
├── Backend/                  # Node.js + Express + Socket.IO Backend Server
│   ├── src/
│   │   ├── controllers/      # Auth, Message, and Support route logic
│   │   ├── lib/              # DB connection, Socket setup, Cloudinary, JWT helpers
│   │   ├── middleware/       # Auth guards, HTTP & Socket rate limiters
│   │   ├── models/           # Mongoose schemas (User, Message, Ticket)
│   │   └── routes/           # REST API route endpoints
│   ├── .env.example          # Backend environment variables template
│   └── package.json
│
└── Frontend/                 # React 18 Single Page Application (Vite)
    ├── src/
    │   ├── components/       # Chat container, Sidebar, Navbar, Legal, Support components
    │   ├── context/          # Notification context provider
    │   ├── hooks/            # Custom React hooks
    │   ├── lib/              # Axios instance setup & error parsing
    │   ├── pages/            # Login, Signup, Profile, Settings, Support, Legal pages
    │   ├── store/            # Zustand state stores (auth, chat, theme, notifications)
    │   └── main.jsx          # Application root entry point
    ├── vercel.json           # Vercel SPA routing rewrite configuration
    ├── .env.example          # Frontend environment variables template
    └── package.json
```

---

## ⚙️ Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Active MongoDB Atlas cluster or local MongoDB instance
- **Cloudinary**: Cloudinary cloud account for media storage
- **Google Cloud Console**: OAuth 2.0 Client ID for Google authentication

### 1. Clone & Backend Installation
```bash
git clone https://github.com/varun1976/Syncrona.git
cd Syncrona/Backend
npm install
```

Create `.env` in the `Backend/` directory:
```env
CLIENT_URL=http://localhost:5173
PORT=5001
NODE_ENV=development

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/syncrona_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_32_chars_min
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
GENERAL_RATE_LIMIT=100
LOGIN_WINDOW_MS=900000
LOGIN_RATE_LIMIT=5
REGISTER_WINDOW_MS=3600000
REGISTER_RATE_LIMIT=5
PROFILE_WINDOW_MS=60000
PROFILE_RATE_LIMIT=20
USERS_WINDOW_MS=60000
USERS_RATE_LIMIT=60
MESSAGE_WINDOW_MS=60000
MESSAGE_RATE_LIMIT=120
SOCKET_RATE_LIMIT_WINDOW_MS=10000
SOCKET_RATE_LIMIT_MAX=30
SOCKET_MAX_VIOLATIONS=10
```

Start the backend server in development mode:
```bash
npm run dev
```

### 2. Frontend Setup
In a new terminal window:
```bash
cd Syncrona/Frontend
npm install
```

Create `.env` in the `Frontend/` directory:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Start the Vite development server:
```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

---

## 🚀 Production Deployment Guide

### Backend Deployment (Render / Railway / AWS)
1. Provision a **Web Service** pointing to the `Backend/` directory.
2. Build Command: `npm install`
3. Start Command: `node src/index.js`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://syncrona.vercel.app`
   - `MONGODB_URI`: `<Production MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Strong 256-bit Random Secret>`
   - `GOOGLE_CLIENT_ID`: `<Google OAuth Client ID>`
   - `CLOUDINARY_*`: `<Production Cloudinary Credentials>`

### Frontend Deployment (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `Frontend`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Set Environment Variables:
   - `VITE_API_URL`: `https://syncrona-backend.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://syncrona-backend.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID`: `<Google OAuth Client ID>`

---

## 🔒 Security Hardening Summary

| Security Layer | Implementation Details |
| :--- | :--- |
| **Authentication** | Dual verification via HTTP-only cookies + Bearer token headers; Google ID tokens verified via Google OAuth2 client. |
| **Real-Time Security** | Socket connections authenticated via `io.use` JWT middleware; untrusted query param claims rejected. |
| **NoSQL Injection** | Parameter type checks (`typeof === 'string'`) enforce strict string schemas before MongoDB execution. |
| **CORS Policy** | Restricted origin list enforcing strict matching against `CLIENT_URL` without wildcard subdomains. |
| **Data Privacy** | Excluded sensitive OAuth identifiers (`googleId`) and hashed passwords from user listings. |
| **HTTP Security** | Hardened Helmet configuration (strict referrer policy, frameguard `deny`, nosniff protection). |
| **File Storage** | Base64 MIME validation, 10MB body cap, and Cloudinary `allowed_formats` restrictions. |

---

## 📝 License

This project is open-source and licensed under the [ISC License](LICENSE).
