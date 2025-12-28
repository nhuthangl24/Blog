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

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
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
