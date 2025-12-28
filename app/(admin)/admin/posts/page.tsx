import Link from "next/link";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PlusCircle, Pencil } from "lucide-react";
import DeletePostButton from "./_components/DeletePostButton";

export const dynamic = "force-dynamic";

async function getPosts() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <Link href="/admin/posts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Type
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Date
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {posts.map((post: any) => (
                <tr
                  key={post._id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">{post.title}</td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline">{post.type}</Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        post.status === "published" ? "default" : "secondary"
                      }
                    >
                      {post.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/posts/${post._id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeletePostButton id={post._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
