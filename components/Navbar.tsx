"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { ShieldAlert, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
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
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              NhuThangL24
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/posts"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t("nav.posts")}
            </Link>
            <Link
              href="/topics"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t("nav.topics")}
            </Link>
            <Link
              href="/labs"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t("nav.practice")}
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t("nav.about")}
            </Link>
          </nav>
        </div>

        {/* Mobile Logo */}
        <div className="flex md:hidden flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6" />
            <span className="font-bold">Như Thắng Blog</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none hidden md:block">
            <SearchBar />
          </div>
          <nav className="flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
          </nav>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <div className="mb-4">
            <SearchBar />
          </div>
          <nav className="flex flex-col space-y-4">
            <Link
              href="/posts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {t("nav.posts")}
            </Link>
            <Link
              href="/topics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {t("nav.topics")}
            </Link>
            <Link
              href="/labs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {t("nav.practice")}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {t("nav.about")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
