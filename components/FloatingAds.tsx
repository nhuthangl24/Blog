"use client";

import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingAds() {
  const { settings } = useSettings();
  const [isVisible, setIsVisible] = useState(true);

  const ads = settings?.ads;
  
  if (!ads || !ads.enabled || !isVisible) return null;

  const leftConfig = ads.floatingLeft;
  const rightConfig = ads.floatingRight;

  const hasLeft = leftConfig && leftConfig.enabled && leftConfig.script;
  const hasRight = rightConfig && rightConfig.enabled && rightConfig.script;

  if (!hasLeft && !hasRight) return null;

  return (
    <>
      {/* Left Ad */}
      {hasLeft && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 origin-left scale-75 xl:scale-100 xl:left-2 transition-transform">
            <div className="relative group">
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -top-3 -right-3 h-6 w-6 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50"
                    onClick={() => setIsVisible(false)}
                    title="Close Ads"
                >
                    <X className="h-3 w-3" />
                </Button>
                <div
                    className="w-[160px] overflow-hidden rounded-lg shadow-xl border bg-background/80 backdrop-blur-sm"
                    dangerouslySetInnerHTML={{ __html: leftConfig.script }}
                />
            </div>
        </div>
      )}

      {/* Right Ad */}
      {hasRight && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 origin-right scale-75 xl:scale-100 xl:right-2 transition-transform">
            <div className="relative group">
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -top-3 -left-3 h-6 w-6 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50"
                    onClick={() => setIsVisible(false)}
                    title="Close Ads"
                >
                    <X className="h-3 w-3" />
                </Button>
                <div
                    className="w-[160px] overflow-hidden rounded-lg shadow-xl border bg-background/80 backdrop-blur-sm"
                    dangerouslySetInnerHTML={{ __html: rightConfig.script }}
                />
            </div>
        </div>
      )}
    </>
  );
}
