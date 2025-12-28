import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await Post.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
