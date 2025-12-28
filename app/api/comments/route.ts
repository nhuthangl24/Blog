import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Comment from "@/models/Comment";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  await connectDB();

  const query = postId ? { postId, status: "approved" } : {}; // If no postId (admin view), return all comments regardless of status

  const comments = await Comment.find(query)
    .sort({ createdAt: -1 })
    .populate("postId", "title slug type"); // Populate post details

  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const comment = await Comment.create({
      ...body,
      status: "approved", // Auto-approve for now, or 'pending' if you want moderation
    });

    return NextResponse.json(comment);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
