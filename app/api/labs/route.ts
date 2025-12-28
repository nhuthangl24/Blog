import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lab from "@/models/Lab";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const labs = await Lab.find(query).sort({ createdAt: -1 });
    return NextResponse.json(labs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch labs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const lab = await Lab.create(body);
    return NextResponse.json(lab, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lab" }, { status: 500 });
  }
}
