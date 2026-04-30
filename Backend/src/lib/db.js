import mongoose from 'mongoose';

export const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected Successfully");
    } catch (error) {
        console.log("MongoDB connection error",error);
    }
}