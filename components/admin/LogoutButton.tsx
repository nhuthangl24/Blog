"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
