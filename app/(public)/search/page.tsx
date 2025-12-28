import PostCard from "@/components/PostCard";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

async function searchPosts(query: string) {
  await connectDB();
  const posts = await Post.find({
    status: "published",
    $or: [
      { title: { $regex: query, $options: "i" } },
      { excerpt: { $regex: query, $options: "i" } },
      { contentMDX: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
  })
    .sort({ publishedAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || "";
  const posts = query ? await searchPosts(query) : [];

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        Search Results for "{query}"
      </h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">
          No posts found matching your query.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
