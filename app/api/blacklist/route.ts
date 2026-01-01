import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blacklist from "@/models/Blacklist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const items = await Blacklist.find().sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { keyword, type } = body;

    if (!keyword) {
      return new NextResponse("Keyword is required", { status: 400 });
    }

    await connectDB();

    // Check if exists
    const exists = await Blacklist.findOne({ keyword });
    if (exists) {
      return new NextResponse("Already blacklisted", { status: 409 });
    }

    const newItem = await Blacklist.create({
      keyword,
      type: type || "word",
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
