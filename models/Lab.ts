import mongoose from "mongoose";

const LabSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    contentMDX: { type: String, required: true },
    solutionMDX: { type: String }, // Solution explanation
    challengePath: { type: String }, // Internal route to the vulnerable lab instance
    category: {
      type: String,
      enum: [
        "Web Security",
        "Network Security",
        "Cryptography",
        "Reverse Engineering",
        "Mobile Security",
        "Cloud Security",
        "Other",
      ],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    tags: { type: [String] },
  },
  { timestamps: true }
);

export default mongoose.models.Lab || mongoose.model("Lab", LabSchema);
