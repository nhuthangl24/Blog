import Link from "next/link";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/PostCard";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import Hero from "@/components/Hero";
import LatestPostsHeader from "@/components/LatestPostsHeader";

export const dynamic = "force-dynamic";

async function getLatestPosts() {
  await connectDB();
  console.log("Fetching posts...");
  const posts = await Post.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(6)
    .lean();
  console.log("Posts found:", posts.length);
  return JSON.parse(JSON.stringify(posts));
}

export default async function Home() {
  const posts = await getLatestPosts();

  return (
    <div className="container py-10">
      <Hero />

      <section className="py-8">
        <LatestPostsHeader />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
