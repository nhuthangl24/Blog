import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  title: string;
  title_vi?: string;
  title_zh?: string;
  slug: string;
  excerpt: string;
  excerpt_vi?: string;
  excerpt_zh?: string;
  contentMDX: string;
  contentMDX_vi?: string;
  contentMDX_zh?: string;
  type: "CVE" | "POC" | "WRITEUP" | "ADVISORY";
  cveId?: string;
  cwe?: string;
  cvssScore?: number;
  severity?: "Critical" | "High" | "Medium" | "Low";
  vendor?: string;
  product?: string;
  affectedVersions?: string[];
  fixedVersions?: string[];
  references?: string[];
  githubPocUrl?: string;
  coverImage?: string;
  tags: string[];
  status: "draft" | "published" | "scheduled";
  publishedAt?: Date;
  scheduledAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    title_vi: { type: String },
    title_zh: { type: String },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    excerpt_vi: { type: String },
    excerpt_zh: { type: String },
    contentMDX: { type: String, required: true },
    contentMDX_vi: { type: String },
    contentMDX_zh: { type: String },
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
    coverImage: { type: String },
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

// Auto-map severity based on CVSS score
PostSchema.pre<IPost>("save", function (next) {
  if (this.cvssScore) {
    if (this.cvssScore >= 9.0) this.severity = "Critical";
    else if (this.cvssScore >= 7.0) this.severity = "High";
    else if (this.cvssScore >= 4.0) this.severity = "Medium";
    else this.severity = "Low";
  }
  next();
});

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
