import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Define User Schema inline to avoid import issues in script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "reader"], default: "reader" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Define Post Schema inline
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    contentMDX: { type: String, required: true },
    type: {
      type: String,
      enum: ["CVE", "POC", "WRITEUP", "ADVISORY"],
      required: true,
    },
    cveId: { type: String },
    cwe: { type: String },
    cvssScore: { type: Number, min: 0, max: 10 },
    severity: { type: String, enum: ["Critical", "High", "Medium", "Low"] },
    vendor: { type: String },
    product: { type: String },
    affectedVersions: { type: [String] },
    fixedVersions: { type: [String] },
    references: { type: [String] },
    githubPocUrl: { type: String },
    tags: { type: [String] },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishedAt: { type: Date },
    scheduledAt: { type: Date },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: "Admin User",
        email: adminEmail,
        passwordHash,
        role: "admin",
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log("Admin user already exists");
    }

    // Seed Sample Posts
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      const posts = [
        {
          title: "CVE-2024-1234: Critical RCE in ExampleApp",
          slug: "cve-2024-1234-rce-exampleapp",
          excerpt:
            "A critical Remote Code Execution vulnerability was found in ExampleApp versions < 2.0.",
          contentMDX: `
# CVE-2024-1234 Analysis

## Summary
This is a critical vulnerability allowing unauthenticated attackers to execute arbitrary code.

## PoC
\`\`\`python
import requests

target = "http://example.com"
payload = {"cmd": "id"}
r = requests.post(target + "/api/v1/debug", json=payload)
print(r.text)
\`\`\`

## Mitigation
Upgrade to version 2.0.1 immediately.
          `,
          type: "CVE",
          cveId: "CVE-2024-1234",
          cvssScore: 9.8,
          severity: "Critical",
          vendor: "ExampleCorp",
          product: "ExampleApp",
          affectedVersions: ["1.0", "1.1", "1.9"],
          fixedVersions: ["2.0.1"],
          tags: ["RCE", "Critical", "Web"],
          status: "published",
          publishedAt: new Date(),
        },
        {
          title: "Writeup: Hacking the Mainframe",
          slug: "hacking-the-mainframe-writeup",
          excerpt:
            "A detailed walkthrough of how I bypassed the firewall and gained access.",
          contentMDX: "This is a placeholder for a detailed writeup...",
          type: "WRITEUP",
          tags: ["CTF", "Network Security"],
          status: "published",
          publishedAt: new Date(),
        },
      ];

      await Post.insertMany(posts);
      console.log("Sample posts created");
    }

    console.log("Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
