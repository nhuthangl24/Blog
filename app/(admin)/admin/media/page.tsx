"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Loader2, Upload, Copy, Check, Trash2 } from "lucide-react";

export default function MediaPage() {
  const [files, setFiles] = useState<
    { id: string; name: string; url: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchFiles = () => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        fetchFiles();
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
        <div className="relative">
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleUpload}
            accept="image/*"
            disabled={uploading}
          />
          <Button disabled={uploading}>
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Image
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <p className="text-muted-foreground">No media files found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <Card key={file.name} className="overflow-hidden group relative">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(file.url)}
                  >
                    {copied === file.url ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied === file.url ? "Copied" : "Copy URL"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    disabled={deleting === file.id}
                  >
                    {deleting === file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
              <div className="p-2 text-xs truncate bg-background border-t">
                {file.name}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
