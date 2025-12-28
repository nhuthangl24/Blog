"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3")).map(
      (elem) => ({
        id: elem.id,
        text: elem.textContent || "",
        level: Number(elem.tagName.substring(1)),
      })
    );
    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    elements.forEach((elem) => {
      const target = document.getElementById(elem.id);
      if (target) observer.observe(target);
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-4">
        Nội dung
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block transition-colors hover:text-foreground",
                activeId === heading.id
                  ? "text-primary font-medium border-l-2 border-primary pl-2 -ml-2"
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
                setActiveId(heading.id);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
