import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    await Comment.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    // Allow updating status, content, and author
    const { status, content, author } = body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (content) updateData.content = content;
    if (author) updateData.author = author;

    await connectDB();
    const comment = await Comment.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
