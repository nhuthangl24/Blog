import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  author: string;
  content: string;
  status: "pending" | "approved" | "spam" | "rejected";
  isAdmin: boolean;
  parentId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "spam", "rejected"],
    default: "pending",
  },
  isAdmin: { type: Boolean, default: false },
  parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
