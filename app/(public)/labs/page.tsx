import Link from "next/link";
import connectDB from "@/lib/db";
import Lab from "@/models/Lab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Network,
  Lock,
  Cpu,
  Smartphone,
  Cloud,
  Construction,
  Terminal,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  "Web Security": Globe,
  "Network Security": Network,
  Cryptography: Lock,
  "Reverse Engineering": Cpu,
  "Mobile Security": Smartphone,
  "Cloud Security": Cloud,
  Other: Terminal,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Web Security": "SQL Injection, XSS, CSRF, SSRF, and more.",
  "Network Security": "Packet analysis, port scanning, and protocol attacks.",
  Cryptography: "Encryption, hashing, and breaking weak ciphers.",
  "Reverse Engineering": "Analyzing binaries and understanding low-level code.",
  "Mobile Security": "Android and iOS application security testing.",
  "Cloud Security": "Securing AWS, Azure, and GCP environments.",
  Other: "Miscellaneous security challenges.",
};

async function getLabs() {
  await connectDB();
  const labs = await Lab.find({ status: "published" })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(labs));
}

export default async function LabsPage() {
  const labs = await getLabs();

  // Group labs by category
  const labsByCategory = labs.reduce((acc: any, lab: any) => {
    if (!acc[lab.category]) acc[lab.category] = [];
    acc[lab.category].push(lab);
    return acc;
  }, {});

  // Ensure all predefined categories are present
  const categories = [
    "Web Security",
    "Network Security",
    "Cryptography",
    "Reverse Engineering",
    "Mobile Security",    "Cloud Security",
    "Other",
  ];

  return (
    <div className="container py-10 space-y-10">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <Construction className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Practice Labs</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A hands-on environment to practice your security skills.
          <br />
          {labs.length === 0 && (
            <span className="font-semibold text-primary">Coming Soon</span>
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category] || Terminal;
          const categoryLabs = labsByCategory[category] || [];
          const hasLabs = categoryLabs.length > 0;
          const categorySlug = category.toLowerCase().replace(/ /g, "-");

          return (
            <Link 
              key={category} 
              href={`/labs/categories/${categorySlug}`}
              className={`block h-full ${!hasLabs ? "pointer-events-none" : ""}`}
            >
              <Card
                className={`flex flex-col h-full hover:border-primary/50 transition-colors ${
                  !hasLabs ? "border-dashed opacity-75" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${hasLabs ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`w-5 h-5 ${hasLabs ? "text-primary" : ""}`} />
                    </div>
                    <CardTitle>{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_DESCRIPTIONS[category]}
                  </p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <Badge variant={hasLabs ? "secondary" : "outline"}>
                      {hasLabs ? `${categoryLabs.length} Labs` : "Coming Soon"}
                    </Badge>
                    {hasLabs && (
                      <span className="text-xs text-primary font-medium">
                        View Labs →
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
