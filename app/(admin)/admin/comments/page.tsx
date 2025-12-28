"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, Folder } from "lucide-react";
import { format } from "date-fns";

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  postId:
    | {
        _id: string;
        title: string;
        slug: string;
        type: string;
      }
    | string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" });
      setComments(comments.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Comments</h1>

      <div className="grid gap-4">
        {comments.map((comment) => (
          <Card key={comment._id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col gap-1">
                <div className="font-semibold">{comment.author}</div>
                {comment.postId && typeof comment.postId === "object" ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>on</span>
                    <Link
                      href={`/posts/${comment.postId.slug}`}
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                      target="_blank"
                    >
                      {comment.postId.title}
                    </Link>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 py-0 h-5"
                    >
                      {comment.postId.type}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Unknown Post
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => handleDelete(comment._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {comment.content}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(comment.createdAt), "MMM d, yyyy HH:mm")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
