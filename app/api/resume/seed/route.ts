import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Resume from "@/models/Resume";
import PersonalInfo from "@/models/PersonalInfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await connectDB();

  // Seed Personal Info
  const existingInfo = await PersonalInfo.findOne();
  if (!existingInfo) {
    await PersonalInfo.create({
      fullName: "Nhu Thang",
      title: "Full Stack Developer",
      bio: "Passionate developer with expertise in Next.js, React, and Node.js.",
      email: "contact@nhuthang.com",
      location: "Ho Chi Minh City, Vietnam",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/nhuthang" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/nhuthang" },
      ],
    });
  }

  // Seed Resume Items
  const count = await Resume.countDocuments();
  if (count === 0) {
    const items = [
      {
        section: "Experience",
        title: "Senior Frontend Developer",
        company: "Tech Corp",
        startDate: "2022",
        endDate: "Present",
        description:
          "Leading the frontend team, building scalable web applications using Next.js and TypeScript.",
        order: 1,
      },
      {
        section: "Experience",
        title: "Web Developer",
        company: "StartUp Inc",
        startDate: "2020",
        endDate: "2022",
        description:
          "Developed and maintained multiple client websites. Implemented responsive designs.",
        order: 2,
      },
      {
        section: "Education",
        title: "Bachelor of Computer Science",
        company: "University of Technology",
        startDate: "2016",
        endDate: "2020",
        description:
          "Graduated with Honors. Specialized in Software Engineering.",
        order: 1,
      },
      {
        section: "Skills",
        title: "Frontend",
        description: "React, Next.js, TypeScript, Tailwind CSS, Redux",
        order: 1,
      },
      {
        section: "Skills",
        title: "Backend",
        description: "Node.js, Express, MongoDB, PostgreSQL, GraphQL",
        order: 2,
      },
    ];

    await Resume.insertMany(items);
  }

  return NextResponse.json({ message: "Seeded successfully" });
}
