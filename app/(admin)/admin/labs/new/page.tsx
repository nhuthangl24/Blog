import LabForm from "../_components/LabForm";

export default function NewLabPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Create New Lab
      </h1>
      <LabForm />
    </div>
  );
}
