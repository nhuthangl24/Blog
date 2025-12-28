import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lab from "@/models/Lab";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const lab = await Lab.findById(params.id);
    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }
    return NextResponse.json(lab);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lab" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const lab = await Lab.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json(lab);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lab" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const lab = await Lab.findByIdAndDelete(params.id);

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lab deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lab" }, { status: 500 });
  }
}
