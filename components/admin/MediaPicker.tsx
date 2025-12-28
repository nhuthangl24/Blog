"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, Loader2, Search, Upload } from "lucide-react";
import Image from "next/image";

interface MediaPickerProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

export default function MediaPicker({ onSelect, trigger }: MediaPickerProps) {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const fetchFiles = () => {
    setLoading(true);
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
    if (open) {
      fetchFiles();
    }
  }, [open]);

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
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" type="button">
            <ImageIcon className="mr-2 h-4 w-4" />
            Select Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Button disabled={uploading} className="cursor-pointer">
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload New
            </Button>
            <Input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
              accept="image/*"
              disabled={uploading}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 border rounded-md p-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No images found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.url}
                  className="group relative aspect-square border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => {
                    onSelect(file.url);
                    setOpen(false);
                  }}
                >
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium truncate px-2">
                      {file.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
