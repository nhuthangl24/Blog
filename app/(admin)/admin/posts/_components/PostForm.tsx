"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import MDXToolbar from "./MDXToolbar";
import MediaPicker from "@/components/admin/MediaPicker";

interface PostFormProps {
  initialData?: any;
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("en");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImage || ""
  );
  const [postType, setPostType] = useState(initialData?.type || "CVE");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const status = formData.get("status");

    const data = {
      title: formData.get("title"),
      title_vi: formData.get("title_vi"),
      title_zh: formData.get("title_zh"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      excerpt_vi: formData.get("excerpt_vi"),
      excerpt_zh: formData.get("excerpt_zh"),
      contentMDX: formData.get("contentMDX"),
      contentMDX_vi: formData.get("contentMDX_vi"),
      contentMDX_zh: formData.get("contentMDX_zh"),
      coverImage: coverImageUrl || formData.get("coverImage"),
      type: formData.get("type"),
      status: status,
      publishedAt:
        status === "published" ? initialData?.publishedAt || new Date() : null,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()),
      // CVE Specific Fields
      cveId: formData.get("cveId"),
      product: formData.get("product"),
      cwe: formData.get("cwe"),
      cvssScore: formData.get("cvssScore"),
      severity: formData.get("severity"),
      affectedVersions: (formData.get("affectedVersions") as string)
        ?.split(",")
        .map((v) => v.trim())
        .filter(Boolean),
      fixedVersions: (formData.get("fixedVersions") as string)
        ?.split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    };

    try {
      const url = initialData ? `/api/posts/${initialData._id}` : "/api/posts";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Common Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Slug</label>
              <Input
                name="slug"
                required
                placeholder="post-slug"
                defaultValue={initialData?.slug}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Type</label>
              <select
                name="type"
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="CVE">CVE</option>
                <option value="POC">PoC</option>
                <option value="WRITEUP">Writeup</option>
                <option value="ADVISORY">Advisory</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue={initialData?.status || "draft"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {postType === "CVE" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/30">
              <div className="col-span-full font-semibold flex items-center gap-2">
                <span className="text-primary">🛡️</span> CVE Details
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">CVE ID</label>
                <Input
                  name="cveId"
                  placeholder="CVE-2024-XXXX"
                  defaultValue={initialData?.cveId}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Product</label>
                <Input
                  name="product"
                  placeholder="e.g. WordPress Plugin"
                  defaultValue={initialData?.product}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Vulnerability Type (CWE)
                </label>
                <Input
                  name="cwe"
                  placeholder="e.g. SQL Injection"
                  defaultValue={initialData?.cwe}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">CVSS Score</label>
                <Input
                  name="cvssScore"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="9.8"
                  defaultValue={initialData?.cvssScore}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Severity</label>
                <select
                  name="severity"
                  defaultValue={initialData?.severity || "Critical"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Affected Versions</label>
                <Input
                  name="affectedVersions"
                  placeholder="1.0, 1.2, < 2.0"
                  defaultValue={initialData?.affectedVersions?.join(", ")}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Fixed Versions</label>
                <Input
                  name="fixedVersions"
                  placeholder="2.0.1"
                  defaultValue={initialData?.fixedVersions?.join(", ")}
                />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <label className="text-sm font-medium">Cover Image</label>
            <div className="flex gap-2 items-center">
              <Input
                name="coverImage"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <MediaPicker onSelect={setCoverImageUrl} />
            </div>
            {coverImageUrl && (
              <div className="relative w-full h-48 mt-2 rounded-md overflow-hidden border bg-muted">
                <img
                  src={coverImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Tags (comma separated)
            </label>
            <Input
              name="tags"
              placeholder="web, rce, critical"
              defaultValue={initialData?.tags?.join(", ")}
            />
          </div>

          {/* Language Tabs */}
          <div className="border-t pt-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <Button
                type="button"
                variant={activeTab === "en" ? "default" : "outline"}
                onClick={() => setActiveTab("en")}
                className="min-w-[100px]"
              >
                English (Default)
              </Button>
              <Button
                type="button"
                variant={activeTab === "vi" ? "default" : "outline"}
                onClick={() => setActiveTab("vi")}
                className="min-w-[100px]"
              >
                Vietnamese
              </Button>
              <Button
                type="button"
                variant={activeTab === "zh" ? "default" : "outline"}
                onClick={() => setActiveTab("zh")}
                className="min-w-[100px]"
              >
                Chinese
              </Button>
            </div>

            {/* English Content */}
            <div className={activeTab === "en" ? "space-y-4" : "hidden"}>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  name="title"
                  required
                  placeholder="Post title"
                  defaultValue={initialData?.title}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Excerpt</label>
                <Input
                  name="excerpt"
                  placeholder="Brief summary"
                  defaultValue={initialData?.excerpt}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Content (MDX)</label>
                <div className="border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <MDXToolbar textareaId="mdx-content" />
                  <textarea
                    id="mdx-content"
                    name="contentMDX"
                    required
                    className="min-h-[400px] w-full rounded-b-md border-0 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
                    placeholder="# Content goes here..."
                    defaultValue={initialData?.contentMDX}
                  />
                </div>
              </div>
            </div>

            {/* Vietnamese Content */}
            <div className={activeTab === "vi" ? "space-y-4" : "hidden"}>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title (VI)</label>
                <Input
                  name="title_vi"
                  placeholder="Tiêu đề bài viết"
                  defaultValue={initialData?.title_vi}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Excerpt (VI)</label>
                <Input
                  name="excerpt_vi"
                  placeholder="Tóm tắt ngắn gọn"
                  defaultValue={initialData?.excerpt_vi}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Content (VI)</label>
                <div className="border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <MDXToolbar textareaId="mdx-content-vi" />
                  <textarea
                    id="mdx-content-vi"
                    name="contentMDX_vi"
                    className="min-h-[400px] w-full rounded-b-md border-0 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
                    placeholder="# Nội dung bài viết..."
                    defaultValue={initialData?.contentMDX_vi}
                  />
                </div>
              </div>
            </div>

            {/* Chinese Content */}
            <div className={activeTab === "zh" ? "space-y-4" : "hidden"}>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title (ZH)</label>
                <Input
                  name="title_zh"
                  placeholder="文章标题"
                  defaultValue={initialData?.title_zh}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Excerpt (ZH)</label>
                <Input
                  name="excerpt_zh"
                  placeholder="简短摘要"
                  defaultValue={initialData?.excerpt_zh}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Content (ZH)</label>
                <div className="border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <MDXToolbar textareaId="mdx-content-zh" />
                  <textarea
                    id="mdx-content-zh"
                    name="contentMDX_zh"
                    className="min-h-[400px] w-full rounded-b-md border-0 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
                    placeholder="# 内容..."
                    defaultValue={initialData?.contentMDX_zh}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
