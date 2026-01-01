"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";

export default function AnnouncementBar() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);

  const announcement = settings?.announcement;

  useEffect(() => {
    // Check session storage to see if already dismissed in this session
    const seen = sessionStorage.getItem("announcement-seen");
    if (seen) {
      setHasSeen(true);
    }
  }, []);

  useEffect(() => {
    if (announcement?.enabled && !hasSeen) {
      // Small delay for better UX
      const timer = setTimeout(() => setOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement, hasSeen]);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("announcement-seen", "true");
  };

  if (!announcement || !announcement.enabled) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Announcement
          </DialogTitle>
          <DialogDescription>Thông báo từ Admin</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {announcement.content}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {announcement.link && (
            <Button asChild>
              <Link href={announcement.link} onClick={handleClose}>
                Learn More
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
