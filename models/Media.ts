import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Media || mongoose.model("Media", MediaSchema);
