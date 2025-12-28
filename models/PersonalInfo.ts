import mongoose from "mongoose";

const PersonalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    socialLinks: [
      {
        platform: String,
        url: String,
        icon: String,
      },
    ],
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.PersonalInfo ||
  mongoose.model("PersonalInfo", PersonalInfoSchema);
