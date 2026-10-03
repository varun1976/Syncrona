import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { notify } from "../store/useNotificationStore.js";
import { parseApiError } from "../lib/errorHandler.js";
import { io } from 'socket.io-client';
import { useChatStore } from "./useChatStore.js";

const BASE_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.MODE === "development" ? "http://localhost:5001" : "/");

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isDeletingAccount: false,
    isChangingPassword: false,
    onlineUsers: [],
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                useChatStore.getState().clearCache();
            }
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            set({ authUser: res.data });
            notify.success("Account created successfully. Welcome to Syncrona!", "Registration Complete");
            get().connectSocket();
        } catch (error) {
            const errorMsg = parseApiError(error, "Signup failed. Please try again.");
            notify.error(errorMsg, "Registration Failed");
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem("token");
            useChatStore.getState().clearCache();
            set({ authUser: null });
            notify.success("Logged out successfully.", "Signed Out");
            get().disconnectSocket();
        } catch (error) {
            localStorage.removeItem("token");
            useChatStore.getState().clearCache();
            set({ authUser: null });
            const errorMsg = parseApiError(error, "Logged out");
            notify.info(errorMsg, "Session Ended");
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            set({ authUser: res.data });
            notify.success("Signed in successfully. Welcome back!", "Login Success");
            get().connectSocket();
        } catch (error) {
            const errorMsg = parseApiError(error, "The email or password is incorrect.");
            notify.error(errorMsg, "Login Failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    googleLogin: async (credential) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/google", { idToken: credential });
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            set({ authUser: res.data });
            notify.success("Authenticated with Google successfully.", "Google Sign-In");
            get().connectSocket();
        } catch (error) {
            const errorMsg = parseApiError(error, "Google authentication failed.");
            notify.error(errorMsg, "Google Authentication Error");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            if (data.fullName && !data.profilePic) {
                notify.success("Your profile name has been updated successfully.", "Profile Updated");
            } else if (data.profilePic && !data.fullName) {
                notify.success("Your profile picture has been updated.", "Avatar Updated");
            } else {
                notify.success("Profile updated successfully.", "Profile Updated");
            }
        } catch (error) {
            console.log("error in update profile:", error);
            const errorMsg = parseApiError(error, "Unable to update profile. Please try again.");
            notify.error(errorMsg, "Update Failed");
            throw error;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    changePassword: async (data) => {
        set({ isChangingPassword: true });
        try {
            await axiosInstance.put("/auth/change-password", data);
            notify.success("Your password has been changed successfully.", "Password Updated");
            return true;
        } catch (error) {
            const errorMsg = parseApiError(error, "Unable to change your password. Please check your connection.");
            notify.error(errorMsg, "Password Change Failed");
            throw error;
        } finally {
            set({ isChangingPassword: false });
        }
    },
    deleteAccount: async () => {
        set({ isDeletingAccount: true });
        try {
            await axiosInstance.delete("/auth/delete-account");
            localStorage.removeItem("token");
            useChatStore.getState().clearCache();
            get().disconnectSocket();
            set({ authUser: null });
            notify.success("Your account has been deleted successfully.", "Account Deleted");
            return true;
        } catch (error) {
            const errorMsg = parseApiError(error, "Account deletion failed. Please try again or contact support.");
            notify.error(errorMsg, "Deletion Failed");
            throw error;
        } finally {
            set({ isDeletingAccount: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            transports: ["websocket", "polling"],
            withCredentials: true,
        });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}))