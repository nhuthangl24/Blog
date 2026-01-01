import mongoose, { Schema, Document } from "mongoose";

export interface IBlacklist extends Document {
  keyword: string;
  type: "word" | "ip" | "email";
  createdAt: Date;
}

const BlacklistSchema: Schema = new Schema({
  keyword: { type: String, required: true, unique: true },
  type: { type: String, enum: ["word", "ip", "email"], default: "word" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blacklist ||
  mongoose.model<IBlacklist>("Blacklist", BlacklistSchema);
