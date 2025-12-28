import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const post = await Post.findById(params.id);
    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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
    await Post.findByIdAndDelete(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[POST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const post = await Post.findByIdAndUpdate(params.id, body, { new: true });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POST_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
