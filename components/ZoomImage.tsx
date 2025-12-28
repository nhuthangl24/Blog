"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ZoomImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomImage({ src, alt, className }: ZoomImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span
          className={cn(
            "relative overflow-hidden rounded-lg cursor-zoom-in block",
            className
          )}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover transition-transform hover:scale-[1.02] duration-300"
          />
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-fit h-fit p-0 border-none bg-transparent shadow-none flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center outline-none">
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-md shadow-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
