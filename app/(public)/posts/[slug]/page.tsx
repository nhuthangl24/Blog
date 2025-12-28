import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import MDXContent from "@/components/MDXContent";
import TableOfContents from "@/components/TableOfContents";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Eye,
  User,
  Folder,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";
import ViewCounter from "@/components/ViewCounter";
import Comments from "@/components/Comments";
import PostHeader from "@/components/PostHeader";
import CVEInfo from "@/components/CVEInfo";
import PostContentSwitcher from "@/components/PostContentSwitcher";

async function getPost(slug: string) {
  await connectDB();
  const post = await Post.findOne({
    slug,
    $or: [
      { status: "published" },
      { status: "scheduled", publishedAt: { $lte: new Date() } },
    ],
  }).lean();
  if (!post) return null;

  return JSON.parse(JSON.stringify(post));
}

async function getCommentCount(postId: string) {
  await connectDB();
  const count = await Comment.countDocuments({ postId, status: "approved" });
  return count;
}

async function getRelatedPosts(currentPostId: string, tags: string[]) {
  await connectDB();
  const relatedPosts = await Post.find({
    _id: { $ne: currentPostId },
    tags: { $in: tags },
    $or: [
      { status: "published" },
      { status: "scheduled", publishedAt: { $lte: new Date() } },
    ],
  })
    .select("title slug coverImage publishedAt type tags")
    .limit(3)
    .sort({ publishedAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(relatedPosts));
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post._id, post.tags || []);
  const commentCount = await getCommentCount(post._id);
  const readingTime = calculateReadingTime(post.contentMDX);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="container py-8 max-w-7xl">
        <PostHeader
          title={post.title}
          titleVi={post.title_vi}
          titleZh={post.title_zh}
          type={post.type}
          publishedAt={post.publishedAt}
          readingTime={readingTime}
          views={post.views}
          commentCount={commentCount}
        />

        {/* Hero Image */}
        {post.coverImage && (
          <div className="relative w-full aspect-[21/9] mb-10 rounded-xl overflow-hidden border bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* CVE Info Card */}
            {post.type === "CVE" && (
              <CVEInfo
                product={post.product}
                cveId={post.cveId}
                cwe={post.cwe}
                affectedVersions={post.affectedVersions}
                fixedVersions={post.fixedVersions}
                severity={post.severity}
                cvssScore={post.cvssScore}
              />
            )}

            {/* MDX Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mt-10 [&_:not(pre)>code]:text-primary [&_:not(pre)>code]:bg-muted/50 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded prose-code:before:content-none prose-code:after:content-none">
              <PostContentSwitcher
                contentEn={<MDXContent source={post.contentMDX} />}
                contentVi={
                  post.contentMDX_vi ? (
                    <MDXContent source={post.contentMDX_vi} />
                  ) : undefined
                }
                contentZh={
                  post.contentMDX_zh ? (
                    <MDXContent source={post.contentMDX_zh} />
                  ) : undefined
                }
              />
            </div>

            {/* Tags Footer */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-bold text-lg mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link key={tag} href={`/tags/${tag}`}>
                    <Badge
                      variant="secondary"
                      className="hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-bold text-lg mb-6">Related Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((related: any) => (
                    <Link
                      href={`/posts/${related.slug}`}
                      key={related._id}
                      className="group block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-primary">
                            {related.type}
                          </span>
                          <span>•</span>
                          <span>
                            {format(
                              new Date(related.publishedAt),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                        <h4 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        {related.tags && related.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {related.tags.slice(0, 3).map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-5"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {related.tags.length > 3 && (
                              <span className="text-[10px] text-muted-foreground self-center">
                                +{related.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Comments postId={post._id} />
          </div>

          {/* Sidebar TOC */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </div>
        </div>
      </div>
      <ViewCounter postId={post._id} />
    </div>
  );
}
