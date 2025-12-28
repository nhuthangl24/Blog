"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import MDXToolbar from "../../posts/_components/MDXToolbar";

interface LabFormProps {
  initialData?: any;
}

export default function LabForm({ initialData }: LabFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      contentMDX: formData.get("contentMDX"),
      solutionMDX: formData.get("solutionMDX"),
      challengePath: formData.get("challengePath"),
      category: formData.get("category"),
      difficulty: formData.get("difficulty"),
      status: formData.get("status"),
      tags: (formData.get("tags") as string)
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = initialData ? `/api/labs/${initialData._id}` : "/api/labs";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/labs");
        router.refresh();
      } else {
        console.error("Failed to save lab");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                name="title"
                required
                placeholder="Lab Title"
                defaultValue={initialData?.title}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input
                name="slug"
                required
                placeholder="lab-slug"
                defaultValue={initialData?.slug}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Brief description of the lab..."
              defaultValue={initialData?.description}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select name="category" defaultValue={initialData?.category || "Web Security"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Security">Web Security</SelectItem>
                  <SelectItem value="Network Security">Network Security</SelectItem>
                  <SelectItem value="Cryptography">Cryptography</SelectItem>
                  <SelectItem value="Reverse Engineering">Reverse Engineering</SelectItem>
                  <SelectItem value="Mobile Security">Mobile Security</SelectItem>
                  <SelectItem value="Cloud Security">Cloud Security</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select name="difficulty" defaultValue={initialData?.difficulty || "Beginner"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select name="status" defaultValue={initialData?.status || "draft"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input
              name="tags"
              placeholder="xss, sql-injection, owasp"
              defaultValue={initialData?.tags?.join(", ")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Challenge Path (Internal URL)</label>
            <Input
              name="challengePath"
              placeholder="/challenges/client-side-bypass"
              defaultValue={initialData?.challengePath}
            />
            <p className="text-xs text-muted-foreground">
              Đường dẫn đến trang thực hành (ví dụ: /challenges/client-side-bypass). Để trống nếu không có lab thực hành.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content (MDX)</label>
            <div className="border rounded-md">
              <MDXToolbar textareaId="contentMDX" />
              <Textarea
                id="contentMDX"
                name="contentMDX"
                required
                className="min-h-[400px] border-0 rounded-t-none focus-visible:ring-0"
                placeholder="# Lab Instructions..."
                defaultValue={initialData?.contentMDX}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Solution (MDX)</label>
            <div className="border rounded-md">
              <MDXToolbar textareaId="solutionMDX" />
              <Textarea
                id="solutionMDX"
                name="solutionMDX"
                className="min-h-[300px] border-0 rounded-t-none focus-visible:ring-0"
                placeholder="# Solution Guide..."
                defaultValue={initialData?.solutionMDX}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Lab" : "Create Lab"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
