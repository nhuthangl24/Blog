"use client";

import { useSettings } from "@/contexts/SettingsContext";

interface AdUnitProps {
  position: "sidebar" | "footer";
  className?: string;
}

export default function AdUnit({ position, className }: AdUnitProps) {
  const { settings } = useSettings();
  
  const ads = settings?.ads;

  if (!ads || !ads.enabled) return null;

  // Cast ads to any to allow indexing by position string
  const config = (ads as any)[position];
  if (!config || !config.enabled || !config.script) return null;

  return (
    <div className={`ad-unit ad-${position} w-full ${className || ""}`}>
      <div className="text-xs text-muted-foreground text-center mb-1">Advertisement</div>
      <div 
        className="ad-content flex justify-center overflow-hidden w-full [&>div]:w-full [&>div]:max-w-full [&_img]:max-w-full [&_img]:h-auto [&_iframe]:max-w-full"
        dangerouslySetInnerHTML={{ __html: config.script }}
      />
    </div>
  );
}
