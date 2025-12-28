import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const post = await Post.create({
      ...body,
      author: session.user.id,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POSTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const posts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[POSTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
