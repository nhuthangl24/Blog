import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PersonalInfo from "@/models/PersonalInfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();
  let info = await PersonalInfo.findOne();

  if (!info) {
    // Return empty structure if not found, or create default
    return NextResponse.json({});
  }

  return NextResponse.json(info);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();

    let info = await PersonalInfo.findOne();

    if (info) {
      info = await PersonalInfo.findByIdAndUpdate(info._id, body, {
        new: true,
      });
    } else {
      info = await PersonalInfo.create(body);
    }

    return NextResponse.json(info);
  } catch (error) {
    console.error("Error updating personal info:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
