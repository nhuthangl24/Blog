import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Media from "@/models/Media";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const files = await Media.find()
      .select("filename _id")
      .sort({ createdAt: -1 });

    const fileUrls = files.map((file) => ({
      id: file._id,
      name: file.filename,
      url: `/api/images/${file._id}`,
    }));

    return NextResponse.json(fileUrls);
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json([]);
  }
}
