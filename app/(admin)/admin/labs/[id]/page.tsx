import connectDB from "@/lib/db";
import Lab from "@/models/Lab";
import LabForm from "../_components/LabForm";
import { notFound } from "next/navigation";

async function getLab(id: string) {
  await connectDB();
  const lab = await Lab.findById(id).lean();
  if (!lab) return null;
  return JSON.parse(JSON.stringify(lab));
}

export default async function EditLabPage({
  params,
}: {
  params: { id: string };
}) {
  const lab = await getLab(params.id);

  if (!lab) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Lab</h1>
      <LabForm initialData={lab} />
    </div>
  );
}
