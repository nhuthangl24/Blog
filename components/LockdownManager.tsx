"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";

export default function LockdownManager() {
  const { settings, loading } = useSettings();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading or settings not available, do nothing yet
    if (loading || !settings?.features) return;

    // We only care if tetCountdown is enabled AND lockdown is enabled
    // Note: The user might turn on lockdown but forget tetCountdown enabled switch, 
    // but the UI hides lockdown settings if tetCountdown is false.
    // However, for safety, let's respect tetCountdown switch too.
    if (!settings.features.tetCountdown) return;

    const { lockdown, tetDate } = settings.features;

    // Check if lockdown configuration exists and is enabled
    if (!lockdown?.enabled || !tetDate) return;

    // Allow admin and api routes, AND the countdown page itself to bypass lockdown
    if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname === "/countdown/tet") {
      return;
    }

    const checkLockdown = () => {
      const targetDate = new Date(tetDate);
      if (isNaN(targetDate.getTime())) return;

      const now = new Date();
      
      // Calculate Window
      // Start: tetDate - startBeforeMinutes
      // End: tetDate + endAfterMinutes
      const startTime = new Date(targetDate.getTime() - (lockdown.startBeforeMinutes || 0) * 60 * 1000);
      const endTime = new Date(targetDate.getTime() + (lockdown.endAfterMinutes || 0) * 60 * 1000);

      // Debugging logs (Check console to verify logic)
      // console.log("Lockdown Status:", { 
      //   now: now.toLocaleString(), 
      //   start: startTime.toLocaleString(), 
      //   end: endTime.toLocaleString(), 
      //   active: now >= startTime && now <= endTime 
      // });

      if (now >= startTime && now <= endTime) {
        // Force redirect to countdown page
        router.replace("/countdown/tet");
      }
    };

    // Check immediately on mount/update
    checkLockdown();

    // Check every second
    const interval = setInterval(checkLockdown, 1000);

    return () => clearInterval(interval);

  }, [loading, settings, pathname, router]);

  return null;
}
