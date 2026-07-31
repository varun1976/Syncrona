import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const connString = process.env.MONGODB_URI || process.env.MONGODB_URL;
        if (!connString) {
            console.error("MongoDB Connection Error: Neither MONGODB_URI nor MONGODB_URL is defined in environment variables.");
            return;
        }
        const conn = await mongoose.connect(connString);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
}