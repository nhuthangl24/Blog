import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import PostForm from "../_components/PostForm";

async function getPost(id: string) {
  await connectDB();
  try {
    const post = await Post.findById(id).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    return null;
  }
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Post</h1>
      <PostForm initialData={post} />
    </div>
  );
}
