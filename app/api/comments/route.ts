import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Comment from "@/models/Comment";
import Blacklist from "@/models/Blacklist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const session = await getServerSession(authOptions);

    await connectDB();

    let query: any = {};

    if (postId) {
      if (session?.user?.role === "admin") {
        query = { postId };
      } else {
        // Public view: Approved comments + Own pending comments (if logged in)
        // Note: Matching by 'author' name is weak, but that's what we have in schema.
        // Ideally we should store userId.
        const conditions: any[] = [{ status: "approved" }];
        if (session?.user?.name) {
          conditions.push({
            status: "pending",
            author: session.user.name,
          });
        }
        query = {
          postId,
          $or: conditions,
        };
      }
    } else {
      // Admin dashboard view
      if (session?.user?.role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .populate("postId", "title slug type");

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    await connectDB();

    let status = "approved";
    let isAdmin = false;

    if (session?.user?.role === "admin") {
      isAdmin = true;
    } else {
      // Check blacklist
      const blacklistedWords = await Blacklist.find({ type: "word" });
      const isBlacklisted = blacklistedWords.some(
        (item) =>
          body.content.toLowerCase().includes(item.keyword.toLowerCase()) ||
          body.author.toLowerCase().includes(item.keyword.toLowerCase())
      );

      if (isBlacklisted) {
        status = "pending";
      }
    }

    const comment = await Comment.create({
      ...body,
      parentId: body.parentId || null,
      status,
      isAdmin,
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
