"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, EyeIcon } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

interface PostCardProps {
  post: {
    title: string;
    title_vi?: string;
    title_zh?: string;
    slug: string;
    excerpt: string;
    excerpt_vi?: string;
    excerpt_zh?: string;
    type: string;
    severity?: string;
    publishedAt?: Date;
    views: number;
    tags: string[];
    coverImage?: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const mode = settings?.theme?.mode || "default";

  const title =
    language === "vi"
      ? post.title_vi || post.title
      : language === "zh"
      ? post.title_zh || post.title
      : post.title;
  const excerpt =
    language === "vi"
      ? post.excerpt_vi || post.excerpt
      : language === "zh"
      ? post.excerpt_zh || post.excerpt
      : post.excerpt;

  const severityColor = {
    Critical: "bg-red-500 hover:bg-red-600",
    High: "bg-orange-500 hover:bg-orange-600",
    Medium: "bg-yellow-500 hover:bg-yellow-600",
    Low: "bg-green-500 hover:bg-green-600",
  };

  const getBorderClass = () => {
    switch (mode) {
      case "tet": return "border-red-200 dark:border-red-900";
      case "spring": return "border-pink-200 dark:border-pink-900";
      case "summer": return "border-yellow-200 dark:border-yellow-900";
      case "autumn": return "border-orange-200 dark:border-orange-900";
      case "winter": return "border-blue-200 dark:border-blue-900";
      default: return "";
    }
  };

  return (
    <Card className={`flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow relative ${getBorderClass()}`}>
      {mode === "tet" && (
        <div className="absolute -top-2 -right-2 w-24 h-24 pointer-events-none z-10">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Branch */}
            <path d="M100 0 Q 60 40 20 20" stroke="#5D4037" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M70 30 Q 50 60 30 50" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Flowers */}
            <g transform="translate(85, 15)">
              <circle r="8" fill="#FFD700" />
              <circle r="3" fill="#FF6F00" />
            </g>
            <g transform="translate(65, 35)">
              <circle r="6" fill="#FFD700" />
              <circle r="2" fill="#FF6F00" />
            </g>
            <g transform="translate(45, 25)">
              <circle r="5" fill="#FFD700" />
              <circle r="2" fill="#FF6F00" />
            </g>
            <g transform="translate(35, 55)">
              <circle r="4" fill="#FFD700" />
              <circle r="1.5" fill="#FF6F00" />
            </g>

            {/* Small Lantern hanging */}
            <line x1="50" y1="40" x2="50" y2="60" stroke="#d32f2f" strokeWidth="1" />
            <rect x="45" y="60" width="10" height="14" rx="2" fill="#d32f2f" />
            <line x1="45" y1="60" x2="55" y2="60" stroke="#FFD700" strokeWidth="1" />
            <line x1="45" y1="74" x2="55" y2="74" stroke="#FFD700" strokeWidth="1" />
            <line x1="50" y1="74" x2="50" y2="85" stroke="#d32f2f" strokeWidth="1" />
          </svg>
        </div>
      )}
      {mode === "spring" && (
        <div className="absolute -top-1 -right-1 w-16 h-16 pointer-events-none z-10 opacity-80">
           <svg viewBox="0 0 100 100" className="w-full h-full">
             <circle cx="80" cy="20" r="15" fill="#F48FB1" opacity="0.6" />
             <circle cx="60" cy="10" r="10" fill="#F8BBD0" opacity="0.6" />
             <circle cx="90" cy="40" r="10" fill="#F8BBD0" opacity="0.6" />
           </svg>
        </div>
      )}
      {mode === "summer" && (
        <div className="absolute -top-6 -right-6 w-24 h-24 pointer-events-none z-10 opacity-50">
           <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
             <circle cx="50" cy="50" r="20" fill="#FFD54F" />
             <path d="M50 10 L50 0 M50 90 L50 100 M10 50 L0 50 M90 50 L100 50 M22 22 L15 15 M78 78 L85 85 M22 78 L15 85 M78 22 L85 15" stroke="#FFD54F" strokeWidth="4" />
           </svg>
        </div>
      )}
      {mode === "autumn" && (
        <div className="absolute top-2 right-2 w-8 h-8 pointer-events-none z-10 opacity-80">
           <svg viewBox="0 0 24 24" fill="#FF7043" className="w-full h-full">
             <path d="M12 2 C12 2 20 10 20 16 C20 20 16 22 12 22 C8 22 4 20 4 16 C4 10 12 2 12 2 Z" />
           </svg>
        </div>
      )}
      {mode === "winter" && (
        <div className="absolute top-2 right-2 w-8 h-8 pointer-events-none z-10 opacity-80">
           <svg viewBox="0 0 24 24" fill="none" stroke="#81D4FA" strokeWidth="2" className="w-full h-full">
             <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5" />
           </svg>
        </div>
      )}
      {post.coverImage && (
        <div className="relative w-full h-48">
          <Image
            src={post.coverImage}
            alt={title}
            fill
            className="object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{post.type}</Badge>
          {post.severity && (
            <Badge
              className={
                severityColor[post.severity as keyof typeof severityColor]
              }
            >
              {post.severity}
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-2">
          <Link href={`/posts/${post.slug}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <Badge
                variant="secondary"
                className="text-xs hover:bg-secondary/80 transition-colors"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground border-t pt-4 mt-auto">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>
              {post.publishedAt
                ? format(new Date(post.publishedAt), "MMM d, yyyy")
                : t("meta.draft")}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <EyeIcon className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
