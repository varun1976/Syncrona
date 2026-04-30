# ChatApp 💬

A modern, real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js). This application features secure authentication, profile management, and is designed for seamless communication.

## 🚀 Features

-   **Secure Authentication**: JWT-based authentication with cookies.
-   **User Profiles**: Customizable profiles with image uploads via Cloudinary.
-   **Responsive Design**: Built with Tailwind CSS and DaisyUI for a premium, mobile-friendly experience.
-   **Real-time Ready**: Architecture prepared for Socket.io integration.

## 🛠️ Tech Stack

### Frontend
-   **React**: UI Library
-   **Vite**: Fast Build Tool
-   **Tailwind CSS**: Styling
-   **DaisyUI**: UI Components
-   **React Icons**: Iconography

### Backend
-   **Node.js & Express**: Server Framework
-   **MongoDB & Mongoose**: Database & ODM
-   **Cloudinary**: Media Hosting
-   **JWT**: Secure Token Management
-   **Bcrypt.js**: Password Hashing

## 📁 Project Structure

```text
ChatApp/
├── Backend/          # Node.js Server
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── .env
└── Frontend/         # React Application
    ├── src/
    │   ├── Home/
    │   └── assets/
    └── vite.config.js
```

## ⚙️ Setup & Installation

### Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas account
-   Cloudinary account

### Backend Setup
1.  Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add the following:
    ```env
    PORT=5001
    MONGODB_URL=your_mongodb_url
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### Frontend Setup
1.  Navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📝 License
This project is licensed under the ISC License.
