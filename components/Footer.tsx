"use client";

import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  FactoryIcon,
  Facebook,
  Instagram,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AdUnit from "@/components/AdUnit";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container py-4">
        <AdUnit position="footer" className="mb-6" />
      </div>
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {t("footer.builtBy")}{" "}
          <a
            href="https://www.facebook.com/nthangl24/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Nhu Thang
          </a>
          . {t("footer.sourceCode")}{" "}
          <a
            href="https://github.com/nhuthangl24/Blog"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/nhuthangl24"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.facebook.com/nthangl24/"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/nthangl24/"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/nthangl24/"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:luunhuthang2402@gmail.com"
            className="text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
