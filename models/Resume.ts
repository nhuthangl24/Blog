import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "Experience",
        "Education",
        "Skills",
        "Projects",
        "Certifications",
        "Awards",
      ],
      default: "Experience",
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
