import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Media from "@/models/Media";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const media = await Media.findById(params.id);

    if (!media) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(media.data, {
      headers: {
        "Content-Type": media.contentType,
        "Content-Length": media.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deletedMedia = await Media.findByIdAndDelete(params.id);

    if (!deletedMedia) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse("Image deleted", { status: 200 });
  } catch (error) {
    console.error("Image delete error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
