import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Resume from "@/models/Resume";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const items = await Resume.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resume items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const newItem = await Resume.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create resume item" },
      { status: 500 }
    );
  }
}
