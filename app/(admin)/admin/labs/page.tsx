import Link from "next/link";
import connectDB from "@/lib/db";
import Lab from "@/models/Lab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PlusCircle, Pencil } from "lucide-react";
import DeleteLabButton from "./_components/DeleteLabButton";

export const dynamic = "force-dynamic";

async function getLabs() {
  await connectDB();
  const labs = await Lab.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(labs));
}

export default async function AdminLabsPage() {
  const labs = await getLabs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Labs</h1>
        <Link href="/admin/labs/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Lab
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Category
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Difficulty
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Date
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {labs.map((lab: any) => (
                <tr
                  key={lab._id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">{lab.title}</td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline">{lab.category}</Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="secondary">{lab.difficulty}</Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        lab.status === "published" ? "default" : "secondary"
                      }
                    >
                      {lab.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {format(new Date(lab.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/labs/${lab._id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteLabButton id={lab._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
