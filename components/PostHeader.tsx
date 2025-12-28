"use client";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Eye,
  User,
  Folder,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PostHeaderProps {
  title: string;
  titleVi?: string;
  titleZh?: string;
  type: string;
  publishedAt?: string;
  readingTime: number;
  views: number;
  commentCount: number;
}

export default function PostHeader({
  title,
  titleVi,
  titleZh,
  type,
  publishedAt,
  readingTime,
  views,
  commentCount,
}: PostHeaderProps) {
  const { t, language } = useLanguage();

  const displayTitle =
    language === "vi" && titleVi
      ? titleVi
      : language === "zh" && titleZh
      ? titleZh
      : title;

  return (
    <div className="mb-8 space-y-4">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
        {displayTitle}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-6">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-medium text-foreground">{t("meta.admin")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4" />
          <span>{type}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {publishedAt
              ? format(new Date(publishedAt), "yyyy-MM-dd")
              : t("meta.draft")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            {readingTime} {t("meta.read")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>
            {views} {t("meta.views")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>
            {commentCount} {t("meta.comments")}
          </span>
        </div>
      </div>
    </div>
  );
}
