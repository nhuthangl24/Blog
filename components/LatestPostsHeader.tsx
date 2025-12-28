"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LatestPostsHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold tracking-tight">{t("latest.posts")}</h2>
      <Link href="/posts" className="text-sm font-medium hover:underline">
        {t("home.viewAll")}
      </Link>
    </div>
  );
}
