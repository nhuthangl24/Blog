"use client";

import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Link,
  Image as ImageIcon,
  Code,
  List,
  Heading1,
  Heading2,
  Quote,
  Loader2,
} from "lucide-react";
import { useState, useRef } from "react";

interface MDXToolbarProps {
  textareaId: string;
}

export default function MDXToolbar({ textareaId }: MDXToolbarProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);

    // Update value directly
    textarea.value = newText;
    
    // Trigger input event to notify React hook form or other listeners
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);

    // Restore focus and selection
    textarea.focus();
    textarea.setSelectionRange(start + before.length, end + before.length);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      insertText(`![${file.name}](${data.url})`);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border rounded-t-md bg-muted/50">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("**", "**")}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("*", "*")}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("# ")}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("## ")}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("[", "](url)")}
        title="Link"
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        title="Upload Image"
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("`", "`")}
        title="Inline Code"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("```\n", "\n```")}
        title="Code Block"
      >
        <Code className="h-4 w-4 border border-current rounded-[2px]" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("> ")}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("- ")}
        title="List"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
