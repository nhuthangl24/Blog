import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Lab from "@/models/Lab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Signal } from "lucide-react";
import { format } from "date-fns";

// Helper to convert slug to category name
// e.g. "web-security" -> "Web Security"
function slugToCategory(slug: string) {
  const specialCases: Record<string, string> = {
    "web-security": "Web Security",
    "network-security": "Network Security",
    "cryptography": "Cryptography",
    "reverse-engineering": "Reverse Engineering",
    "mobile-security": "Mobile Security",
    "cloud-security": "Cloud Security",
    "other": "Other"
  };
  
  return specialCases[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

async function getLabsByCategory(categorySlug: string) {
  await connectDB();
  const categoryName = slugToCategory(categorySlug);
  
  const labs = await Lab.find({ 
    status: "published",
    category: categoryName 
  })
    .sort({ createdAt: -1 })
    .lean();
    
  return {
    categoryName,
    labs: JSON.parse(JSON.stringify(labs))
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { categoryName, labs } = await getLabsByCategory(params.category);

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/labs">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
          <p className="text-muted-foreground">
            {labs.length} {labs.length === 1 ? "lab" : "labs"} available
          </p>
        </div>
      </div>

      {labs.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">No labs found in this category yet.</p>
          <Button variant="link" asChild className="mt-2">
            <Link href="/labs">Go back to categories</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab: any) => (
            <Link key={lab._id} href={`/labs/${lab.slug}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={
                      lab.difficulty === "Beginner" ? "default" : 
                      lab.difficulty === "Intermediate" ? "secondary" : "destructive"
                    }>
                      {lab.difficulty}
                    </Badge>
                    {lab.createdAt && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(lab.createdAt), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {lab.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {lab.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>15-30 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Signal className="w-3 h-3" />
                      <span>{lab.difficulty}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
