"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

export default function Comments({ postId }: { postId: string }) {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      });
  }, [postId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          author: formData.get("author"),
          content: formData.get("content"),
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        {t("comments")} ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">{t("comments.name")}</label>
          <Input
            name="author"
            required
            placeholder={t("comments.namePlaceholder")}
            className="max-w-xs"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">{t("comments.content")}</label>
          <Textarea
            name="content"
            required
            placeholder={t("comments.contentPlaceholder")}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitting ? t("comments.submitting") : t("comments.submit")}
        </Button>
      </form>

      <div className="space-y-6">
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground">{t("comments.noComments")}</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment._id}>
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold">
                    {comment.author}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="py-4 pt-0 text-sm">
                {comment.content}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
