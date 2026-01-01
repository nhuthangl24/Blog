"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Reply,
  Edit,
  ChevronRight,
  ChevronDown,
  Ban,
  Shield,
  User,
  Crown,
} from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface BlacklistItem {
  _id: string;
  keyword: string;
  type: "word" | "ip" | "email";
  createdAt: string;
}

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  status: string;
  parentId?: string;
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
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editForm, setEditForm] = useState({ author: "", content: "" });
  
  // Blacklist state
  const [blacklistItems, setBlacklistItems] = useState<BlacklistItem[]>([]);
  const [newBlacklistItem, setNewBlacklistItem] = useState("");
  const [newBlacklistType, setNewBlacklistType] = useState<"word" | "ip" | "email">("word");
  const [addingBlacklist, setAddingBlacklist] = useState(false);

  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  useEffect(() => {
    fetchComments();
    fetchBlacklist();
  }, []);

  const fetchBlacklist = async () => {
    try {
      const res = await fetch("/api/blacklist");
      if (res.ok) {
        const data = await res.json();
        setBlacklistItems(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = () => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      });
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" });
      setComments(comments.filter((c) => c._id !== id));
      showToast("Comment deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setComments(
          comments.map((c) => (c._id === id ? { ...c, status } : c))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReply = async (comment: Comment) => {
    if (!replyContent.trim()) return;

    try {
      const postId =
        typeof comment.postId === "string"
          ? comment.postId
          : comment.postId._id;

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: replyContent,
          parentId: comment._id,
        }),
      });

      if (res.ok) {
        setReplyContent("");
        setReplyingTo(null);
        fetchComments();
        // Auto expand the parent
        setExpandedComments((prev) => new Set(prev).add(comment._id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    if (!editingComment) return;

    try {
      const res = await fetch(`/api/comments/${editingComment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setComments(
          comments.map((c) =>
            c._id === editingComment._id ? { ...c, ...editForm } : c
          )
        );
        setEditingComment(null);
        showToast("Comment updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToBlacklist = async (keyword: string, type: "word" | "ip" | "email" = "word") => {
    try {
      const res = await fetch("/api/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, type }),
      });

      if (res.ok) {
        showToast(`Added "${keyword}" to blacklist`);
        fetchBlacklist(); // Refresh list
      } else if (res.status === 409) {
        showToast(`"${keyword}" is already in blacklist`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleManualAddBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlacklistItem.trim()) return;

    setAddingBlacklist(true);
    try {
      const res = await fetch("/api/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: newBlacklistItem, type: newBlacklistType }),
      });

      if (res.ok) {
        showToast(`Added "${newBlacklistItem}" to blacklist`);
        setNewBlacklistItem("");
        fetchBlacklist();
      } else if (res.status === 409) {
        showToast(`"${newBlacklistItem}" is already in blacklist`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddingBlacklist(false);
    }
  };

  const handleDeleteBlacklist = async (id: string) => {
    try {
      const res = await fetch(`/api/blacklist/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlacklistItems(blacklistItems.filter((item) => item._id !== id));
        showToast("Removed from blacklist");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedComments(newExpanded);
  };

  // Group comments by parentId
  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId);

  const CommentRow = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => {
    const replies = getReplies(comment._id);
    const hasReplies = replies.length > 0;
    const isExpanded = expandedComments.has(comment._id);

    return (
      <>
        <TableRow className={depth > 0 ? "bg-muted/30" : ""}>
          <TableCell className="font-medium">
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${depth * 20}px` }}
            >
              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleExpand(comment._id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {!hasReplies && depth > 0 && (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                </div>
              )}
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
            </div>
          </TableCell>
          <TableCell className="max-w-md truncate" title={comment.content}>
            {comment.content}
          </TableCell>
          <TableCell>
            {typeof comment.postId === "object" ? (
              <Link
                href={`/posts/${comment.postId.slug}`}
                className="hover:underline text-blue-600"
                target="_blank"
              >
                {comment.postId.title}
              </Link>
            ) : (
              "Unknown"
            )}
          </TableCell>
          <TableCell>
            <Badge
              variant={
                comment.status === "approved"
                  ? "default"
                  : comment.status === "spam"
                  ? "destructive"
                  : "secondary"
              }
            >
              {comment.status}
            </Badge>
          </TableCell>
          <TableCell className="whitespace-nowrap">
            {format(new Date(comment.createdAt), "MMM d, HH:mm")}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              {comment.status !== "approved" && (
                <Button
                  size="icon"
                  variant="ghost"
                  title="Approve"
                  onClick={() => handleStatusUpdate(comment._id, "approved")}
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </Button>
              )}
              {comment.status !== "spam" && (
                <Button
                  size="icon"
                  variant="ghost"
                  title="Mark as Spam"
                  onClick={() => handleStatusUpdate(comment._id, "spam")}
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </Button>
              )}

              <Dialog
                open={editingComment?._id === comment._id}
                onOpenChange={(open) => !open && setEditingComment(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Edit"
                    onClick={() => {
                      setEditingComment(comment);
                      setEditForm({
                        author: comment.author,
                        content: comment.content,
                      });
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Author Name</label>
                      <Input
                        value={editForm.author}
                        onChange={(e) =>
                          setEditForm({ ...editForm, author: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm({ ...editForm, content: e.target.value })
                        }
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                size="icon"
                variant="ghost"
                title="Blacklist Author"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleAddToBlacklist(comment.author, "word")}
              >
                <Ban className="w-4 h-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                title="Delete"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(comment._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded &&
          replies.map((reply) => (
            <CommentRow
              key={reply._id}
              comment={reply}
              depth={depth + 1}
            />
          ))}
      </>
    );
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Comments & Moderation</h1>
      </div>

      <Tabs defaultValue="comments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="space-y-4">
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-[250px]">Author</TableHead>
                    <TableHead className="w-[400px]">Content</TableHead>
                    <TableHead>Post</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rootComments.map((comment) => (
                    <CommentRow key={comment._id} comment={comment} />
                  ))}
                  {rootComments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No comments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blacklist" className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
            <form onSubmit={handleManualAddBlacklist} className="flex w-full gap-4 items-end">
              <div className="grid gap-2 flex-1">
                <label className="text-sm font-medium">Keyword / IP / Email</label>
                <Input
                  value={newBlacklistItem}
                  onChange={(e) => setNewBlacklistItem(e.target.value)}
                  placeholder="Enter word to block..."
                />
              </div>
              <div className="grid gap-2 w-[150px]">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newBlacklistType}
                  onValueChange={(v: any) => setNewBlacklistType(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="ip">IP Address</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={addingBlacklist}>
                {addingBlacklist ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add
              </Button>
            </form>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blacklistItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.keyword}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Ban className="w-3 h-3 text-muted-foreground" />
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteBlacklist(item._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {blacklistItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      No items in blacklist
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
}
