"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Shield, Server, Code, Lock, FileWarning, Network } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const topics = [
  {
    title: "Web Security",
    description: "Vulnerabilities in web applications like XSS, SQLi, CSRF.",
    icon: Shield,
    href: "/tags/WebSecurity",
  },
  {
    title: "Network Security",
    description: "Network protocols, firewalls, and infrastructure security.",
    icon: Network,
    href: "/tags/NetworkSecurity",
  },
  {
    title: "File Uploads",
    description:
      "Insecure file upload vulnerabilities and exploitation techniques.",
    icon: FileWarning,
    href: "/tags/FileUpload",
  },
  {
    title: "RCE",
    description: "Remote Code Execution vulnerabilities and PoCs.",
    icon: Server,
    href: "/tags/RCE",
  },
  {
    title: "Cryptography",
    description: "Weak encryption, hashing, and cryptographic failures.",
    icon: Lock,
    href: "/tags/Cryptography",
  },
  {
    title: "Source Code Review",
    description: "Analyzing source code for security flaws.",
    icon: Code,
    href: "/tags/CodeReview",
  },
];

export default function TopicsPage() {
  const { t } = useLanguage();

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        {t("topics.title")}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link key={topic.title} href={topic.href}>
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <topic.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
