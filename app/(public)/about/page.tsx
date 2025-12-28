import connectDB from "@/lib/db";
import Resume from "@/models/Resume";
import PersonalInfo from "@/models/PersonalInfo";
import ResumeContent from "@/components/ResumeContent";

async function getResumeItems() {
  await connectDB();
  const items = await Resume.find({ isVisible: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(items));
}

async function getPersonalInfo() {
  await connectDB();
  const info = await PersonalInfo.findOne().lean();
  return info ? JSON.parse(JSON.stringify(info)) : null;
}

export default async function AboutPage() {
  const [items, personalInfo] = await Promise.all([
    getResumeItems(),
    getPersonalInfo(),
  ]);

  const groupedItems = items.reduce((acc: any, item: any) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <ResumeContent groupedItems={groupedItems} personalInfo={personalInfo} />
  );
}
