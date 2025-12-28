import PostCard from "@/components/PostCard";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

async function getPostsByTag(tag: string) {
  await connectDB();
  // Case insensitive search for tags
  const posts = await Post.find({
    status: "published",
    tags: { $regex: new RegExp(`^${tag}$`, "i") },
  })
    .sort({ publishedAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const decodedTag = decodeURIComponent(params.tag);
  const posts = await getPostsByTag(decodedTag);

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        Tag: #{decodedTag}
      </h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts found with this tag.</p>
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
