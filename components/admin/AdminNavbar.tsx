"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, FileText, FlaskConical, Image as ImageIcon, MessageSquare, Briefcase, User } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import LogoutButton from "@/components/admin/LogoutButton";
import { cn } from "@/lib/utils";

interface AdminNavbarProps {
  userEmail?: string | null;
}

export default function AdminNavbar({ userEmail }: AdminNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Posts", icon: FileText },
    { href: "/admin/labs", label: "Labs", icon: FlaskConical },
    { href: "/admin/media", label: "Media", icon: ImageIcon },
    { href: "/admin/comments", label: "Comments", icon: MessageSquare },
    { href: "/admin/resume", label: "Resume", icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Desktop Logo & Nav */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold hidden md:block">
            Admin Dashboard
          </Link>
          <Link href="/admin" className="font-bold md:hidden">
            Admin
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin/profile"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {userEmail}
          </Link>
          <ModeToggle />
          <Link href="/">
            <Button variant="outline" size="sm">
              View Site
            </Button>
          </Link>
          <LogoutButton />
        </div>

        {/* Mobile User Actions (Simplified) */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {userEmail}
            </div>
            <Link href="/" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start">
                View Site
              </Button>
            </Link>
            <div className="flex justify-start">
               <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
