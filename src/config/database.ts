import mongoose from "mongoose";

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Logs connection status and exits process on failure.
 */
export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/magic-transporters";

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
