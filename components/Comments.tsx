"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, MessageSquare, Reply, Shield, User, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "next-auth/react";

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  status: string;
  isAdmin: boolean;
  parentId?: string;
}

export default function Comments({ postId }: { postId: string }) {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      });
  }, [postId]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    parentId?: string
  ) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    // Get author from form data (user input)
    // If empty, fallback to session name or Anonymous
    const authorInput = formData.get("author")?.toString().trim();
    const authorName = authorInput || session?.user?.name || "Anonymous";

    try {
      const payload = {
        postId,
        author: authorName,
        content: formData.get("content"),
        parentId: parentId || null,
      };

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        (e.target as HTMLFormElement).reset();
        setReplyingTo(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => {
    const isPending = comment.status === "pending";
    const replies = comments
      .filter((c) => String(c.parentId) === String(comment._id))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    return (
      <div className={`mb-4 ${depth > 0 ? "ml-8 border-l-2 pl-4" : ""}`}>
        <Card className={`${isPending ? "opacity-60" : ""}`}>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold flex items-center gap-1">
                  {comment.author}
                  {comment.isAdmin ? (
                    <Badge
                      variant="default"
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border-none ml-1 shadow-sm text-white"
                    >
                      <Crown className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="ml-1">
                      <User className="w-3 h-3 mr-1" /> User
                    </Badge>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.createdAt), "MMM d, yyyy HH:mm")}
                </span>
                {isPending && (
                  <Badge
                    variant="outline"
                    className="text-yellow-600 border-yellow-600"
                  >
                    Pending Approval
                  </Badge>
                )}
              </div>
              {!isPending && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setReplyingTo(replyingTo === comment._id ? null : comment._id)
                  }
                >
                  <Reply className="w-4 h-4 mr-1" />{" "}
                  {t("comments.reply") || "Reply"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="whitespace-pre-wrap text-sm">{comment.content}</p>

            {replyingTo === comment._id && (
              <div className="mt-4">
                <form
                  onSubmit={(e) => handleSubmit(e, comment._id)}
                  className="space-y-2"
                >
                  <Input
                    name="author"
                    required={!session?.user}
                    placeholder={
                      session?.user?.name
                        ? `${session.user.name}`
                        : t("comments.namePlaceholder")
                    }
                    className="max-w-xs"
                  />
                  <Textarea
                    name="content"
                    required
                    placeholder={
                      t("comments.replyPlaceholder") || "Write a reply..."
                    }
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={submitting}>
                      {submitting && (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      )}
                      Reply
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {replies.map((reply) => (
          <CommentItem key={reply._id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    );
    (c) => !c.parentId || c.parentId === null
  
  };

  const rootComments = comments.filter((c) => !c.parentId);

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        {t("comments")} ({comments.length})
      </h3>

      <form onSubmit={(e) => handleSubmit(e)} className="mb-10 space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">{t("comments.name")}</label>
          <Input
            name="author"
            required={!session?.user}
            placeholder={
              session?.user?.name
                ? `${session.user.name}`
                : t("comments.namePlaceholder")
            }
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
          rootComments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
