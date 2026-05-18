import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

if (!MONGO_URI) {
    console.error("Missing required environment variable: MONGO_URI or MONGO_URL");
    throw new Error("MONGO_URI or MONGO_URL is not defined. Configure it in your .env or deployment environment.");
}

const main = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

export default main;