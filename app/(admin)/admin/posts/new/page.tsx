import PostForm from "../_components/PostForm";

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Create New Post
      </h1>
      <PostForm />
    </div>
  );
}
