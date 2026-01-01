import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blacklist from "@/models/Blacklist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const deleted = await Blacklist.findByIdAndDelete(params.id);

    if (!deleted) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(deleted);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
