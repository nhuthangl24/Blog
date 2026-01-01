import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import PersonalInfo from "../models/PersonalInfo";
import Resume from "../models/Resume";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function seedResume() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Clear Personal Info
    console.log("Clearing Personal Info...");
    await PersonalInfo.deleteMany({});

    // 2. Clear Resume Items
    console.log("Clearing Resume Items...");
    await Resume.deleteMany({});

    console.log("Resume data cleared successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing resume data:", error);
    process.exit(1);
  }
}

seedResume();
