import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MONGODB connected successfully");
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}