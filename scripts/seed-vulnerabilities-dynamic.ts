import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Define Post Schema inline to avoid alias issues
const PostSchema = new mongoose.Schema(
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

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function getFiles(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      if (file === "README.md") {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

async function seedVulnerabilities() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const rootDir = path.join(process.cwd(), "Vulnerabilities");
    if (!fs.existsSync(rootDir)) {
      console.error(`Directory not found: ${rootDir}`);
      process.exit(1);
    }

    const files = getFiles(rootDir);
    console.log(`Found ${files.length} README.md files.`);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      const titleLine = lines.find((line) => line.startsWith("# "));
      const title = titleLine ? titleLine.replace("# ", "").trim() : "Untitled";

      // Determine slug from parent folder name
      const parentDir = path.basename(path.dirname(filePath));
      // If parent dir is "Vulnerabilities", use the title for slug, otherwise use parent dir
      let slug =
        parentDir === "Vulnerabilities" ? slugify(title) : slugify(parentDir);

      // Handle duplicate slugs if necessary (simple append)
      // For now, assuming folder names are unique enough or we want to overwrite

      // Determine tags from path
      const relativePath = path.relative(rootDir, filePath);
      const pathParts = relativePath.split(path.sep);
      // Remove README.md
      pathParts.pop();
      const tags = ["Vulnerability", ...pathParts];

      console.log(`Processing: ${title} (${slug})`);

      const postData = {
        title: title, // English title (using same as VI for now as placeholder)
        title_vi: title,
        slug: slug,
        excerpt: `Detailed writeup about ${title}`,
        excerpt_vi: `Bài viết chi tiết về ${title}`,
        contentMDX: content, // English content (using same as VI for now)
        contentMDX_vi: content,
        type: "WRITEUP",
        tags: tags,
        status: "published",
        publishedAt: new Date(),
      };

      await Post.findOneAndUpdate({ slug: slug }, postData, {
        upsert: true,
        new: true,
      });
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedVulnerabilities();
