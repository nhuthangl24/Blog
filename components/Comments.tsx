"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Loader2,
  MessageSquare,
  Reply,
  Shield,
  User,
  Crown,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Root comments pagination
  const [visibleRootCount, setVisibleRootCount] = useState(2);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = () => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch comments");
        return res.json();
      })
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load comments. Please try again later.");
        setLoading(false);
      });
  };

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    parentId?: string
  ) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

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

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const handleToggleVisibility = async (comment: Comment) => {
    const newStatus = comment.status === "approved" ? "rejected" : "approved";
    try {
      const res = await fetch(`/api/comments/${comment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c._id === comment._id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (error) {
      console.error("Failed to update comment status", error);
    }
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => {
    const [visibleReplyCount, setVisibleReplyCount] = useState(0);
    const isPending = comment.status === "pending";
    const isRejected = comment.status === "rejected";
    const isAdminUser = session?.user?.role === "admin";

    const replies = comments
      .filter((c) => String(c.parentId) === String(comment._id))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    const visibleReplies = replies.slice(0, visibleReplyCount);
    const hasMoreReplies = replies.length > visibleReplyCount;

    return (
      <div className={`mb-4 ${depth > 0 ? "ml-2 md:ml-8 border-l-2 pl-2 md:pl-4" : ""}`}>
        <Card className={`${isPending || isRejected ? "opacity-60" : ""} ${isRejected ? "bg-red-50 dark:bg-red-900/10" : ""}`}>
          <CardHeader className="p-3 md:p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold flex items-center gap-1 text-sm md:text-base">
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
                {isRejected && isAdminUser && (
                   <Badge variant="destructive">Hidden</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!isPending && !isRejected && (
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
                
                {isAdminUser && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleToggleVisibility(comment)}
                      title={isRejected ? "Unhide" : "Hide"}
                    >
                      {isRejected ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(comment._id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
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

        {visibleReplies.map((reply) => (
          <CommentItem key={reply._id} comment={reply} depth={depth + 1} />
        ))}
        
        {replies.length > 0 && (
            <div className="mt-2 ml-2">
                {hasMoreReplies ? (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setVisibleReplyCount(prev => prev + 5)}
                        className="text-xs text-muted-foreground"
                    >
                        <ChevronDown className="w-3 h-3 mr-1" /> 
                        {visibleReplyCount === 0 
                            ? `Show ${replies.length} replies` 
                            : `Show more replies (${replies.length - visibleReplyCount} remaining)`}
                    </Button>
                ) : (
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setVisibleReplyCount(0)}
                        className="text-xs text-muted-foreground"
                    >
                        <ChevronUp className="w-3 h-3 mr-1" /> Hide replies
                    </Button>
                )}
            </div>
        )}
      </div>
    );
  };

  const rootComments = comments.filter((c) => !c.parentId);
  const visibleRootComments = rootComments.slice(0, visibleRootCount);
  const hasMoreRootComments = rootComments.length > visibleRootCount;

  if (error) {
    return (
      <div className="mt-12 border-t pt-8">
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

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
          <>
            {visibleRootComments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
            ))}
            
            {rootComments.length > 2 && (
                <div className="flex justify-center mt-4">
                    {hasMoreRootComments ? (
                        <Button 
                            variant="outline" 
                            onClick={() => setVisibleRootCount(prev => prev + 5)}
                        >
                            Show more comments
                        </Button>
                    ) : (
                        <Button 
                            variant="outline" 
                            onClick={() => setVisibleRootCount(2)}
                        >
                            Show less
                        </Button>
                    )}
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
