"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  GraduationCap,
  Code,
  Award,
  FileText,
  User,
  MapPin,
  Mail,
  Download,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SECTION_ICONS: Record<string, any> = {
  Experience: Briefcase,
  Education: GraduationCap,
  Skills: Code,
  Projects: FileText,
  Certifications: Award,
  Awards: Award,
};

export default function ResumeContent({ groupedItems, personalInfo }: any) {
  const { t } = useLanguage();

  const sections = [
    "Experience",
    "Education",
    "Skills",
    "Projects",
    "Certifications",
    "Awards",
  ];

  return (
    <div className="container max-w-4xl py-10 space-y-10 px-4 md:px-0">
      <div className="space-y-6 text-center">
        {personalInfo?.avatar ? (
          <img
            src={personalInfo.avatar}
            alt={personalInfo.fullName}
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-background shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 bg-muted rounded-full mx-auto flex items-center justify-center">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {personalInfo?.fullName || t("about.me")}
          </h1>
          <p className="text-xl font-medium text-primary">
            {personalInfo?.title}
          </p>
        </div>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {personalInfo?.bio ||
            "Security Researcher & Full Stack Developer passionate about uncovering vulnerabilities and building secure systems."}
        </p>

        {personalInfo && (
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {personalInfo.email}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <a
            href=""
            download=""
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download CV
          </a>
        </div>
      </div>

      <div className="grid gap-8">
        {sections.map((section) => {
          const items = groupedItems[section];
          if (!items?.length) return null;

          const Icon = SECTION_ICONS[section] || FileText;

          return (
            <Card
              key={section}
              className="border-none shadow-none bg-transparent"
            >
              <CardHeader className="px-0 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {t(`resume.${section.toLowerCase()}`)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-0 grid gap-6">
                {items.map((item: any) => (
                  <div
                    key={item._id}
                    className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.startDate && (
                          <Badge variant="secondary" className="w-fit">
                            {new Date(item.startDate).getFullYear()} -{" "}
                            {item.endDate
                              ? new Date(item.endDate).getFullYear()
                              : "Present"}
                          </Badge>
                        )}
                      </div>
                      {item.organization && (
                        <div className="text-muted-foreground font-medium">
                          {item.organization}
                        </div>
                      )}
                      {item.description && (
                        <div className="text-muted-foreground leading-relaxed">
                          {item.description.includes("•") ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {item.description
                                .split("\n")
                                .map((line: string, i: number) => {
                                  const cleanLine = line
                                    .trim()
                                    .replace(/^•\s*/, "");
                                  if (!cleanLine) return null;
                                  return <li key={i}>{cleanLine}</li>;
                                })}
                            </ul>
                          ) : (
                            <p className="whitespace-pre-line">
                              {item.description}
                            </p>
                          )}
                        </div>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-primary hover:underline mt-1"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
