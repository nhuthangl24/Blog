"use client";

import { useEffect } from "react";

export default function ViewCounter({ postId }: { postId: string }) {
  useEffect(() => {
    const viewedPosts = JSON.parse(
      sessionStorage.getItem("viewedPosts") || "[]"
    );

    if (!viewedPosts.includes(postId)) {
      fetch(`/api/posts/${postId}/view`, { method: "POST" });
      viewedPosts.push(postId);
      sessionStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
    }
  }, [postId]);

  return null;
}
