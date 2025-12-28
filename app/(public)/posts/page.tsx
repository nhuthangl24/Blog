import PostCard from "@/components/PostCard";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

async function getPosts() {
  await connectDB();
  const posts = await Post.find({
    $or: [
      { status: "published" },
      { status: "scheduled", publishedAt: { $lte: new Date() } },
    ],
  })
    .sort({ publishedAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">All Posts</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
