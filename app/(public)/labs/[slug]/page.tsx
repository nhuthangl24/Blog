import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import Lab from "@/models/Lab";
import MDXContent from "@/components/MDXContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, FlaskConical, Lightbulb, CheckCircle2 } from "lucide-react";

async function getLab(slug: string) {
  await connectDB();
  const lab = await Lab.findOne({ slug, status: "published" }).lean();
  if (!lab) return null;
  return JSON.parse(JSON.stringify(lab));
}

export default async function LabPage({
  params,
}: {
  params: { slug: string };
}) {
  const lab = await getLab(params.slug);

  if (!lab) {
    notFound();
  }

  return (
    <div className="container py-10 max-w-4xl">
      <Link href="/labs">
        <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Labs
        </Button>
      </Link>

      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Lab: {lab.title}
          </h1>
          
          <div className="flex items-center gap-4">
            <Badge 
              className={`uppercase text-xs font-bold tracking-wider ${
                lab.difficulty === "Beginner" ? "bg-green-500 hover:bg-green-600" :
                lab.difficulty === "Intermediate" ? "bg-orange-500 hover:bg-orange-600" :
                "bg-red-500 hover:bg-red-600"
              }`}
            >
              {lab.difficulty}
            </Badge>
            
            {/* Placeholder for "Solved" status - in a real app this would check user progress */}
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <FlaskConical className="w-4 h-4" />
              <span>LAB</span>
            </div>
          </div>
        </div>

        {/* Description & Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <MDXContent source={lab.contentMDX} />
        </div>

        {/* Action Button */}
        {lab.challengePath && (
          <div className="pt-4">
            <Button asChild size="lg" className="bg-[#ff6633] hover:bg-[#e55c2e] text-white font-bold rounded-full px-8">
              <Link href={lab.challengePath} target="_blank">
                ACCESS THE LAB
              </Link>
            </Button>
          </div>
        )}

        {/* Solution Section */}
        {lab.solutionMDX && (
          <div className="pt-8 border-t">
            <Accordion type="single" collapsible className="w-full bg-muted/30 rounded-lg border px-4">
              <AccordionItem value="solution" className="border-none">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <Lightbulb className="w-5 h-5" />
                    Solution
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <MDXContent source={lab.solutionMDX} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
