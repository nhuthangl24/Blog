import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  key: string; // e.g., "general", "ads", "theme"
  value: any; // Flexible structure
  updatedAt: Date;
}

const SettingSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Setting ||
  mongoose.model<ISetting>("Setting", SettingSchema);
