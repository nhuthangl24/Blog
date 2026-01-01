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

  const config = ads[position];
  if (!config || !config.enabled || !config.script) return null;

  return (
    <div className={`ad-unit ad-${position} ${className || ""}`}>
      <div className="text-xs text-muted-foreground text-center mb-1">Advertisement</div>
      <div 
        className="ad-content flex justify-center overflow-hidden"
        dangerouslySetInnerHTML={{ __html: config.script }}
      />
    </div>
  );
}
