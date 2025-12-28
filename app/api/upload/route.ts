import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Media from "@/models/Media";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await connectDB();

    const media = await Media.create({
      filename: file.name,
      contentType: file.type,
      data: buffer,
      size: file.size,
    });

    return NextResponse.json({
      url: `/api/images/${media._id}`,
      name: media.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
