"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { ShieldAlert, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useSettings } from "@/contexts/SettingsContext";

export default function Navbar() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const mode = settings?.theme?.mode;
  const isTetOrSpring = mode === "tet" || mode === "spring";
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
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 relative group"
          >
            <span className="hidden font-bold sm:inline-block relative">
              NhuThangL24
              {isTetOrSpring && (
                <div className="absolute -bottom-3 -right-10 w-20 h-12 pointer-events-none animate-pulse">
                  <svg
                    viewBox="0 0 80 50"
                    className="w-full h-full drop-shadow-sm overflow-visible"
                  >
                    {/* Main Branch */}
                    <path
                      d="M0,50 Q30,40 50,20 T80,5"
                      fill="none"
                      stroke="#5D4037"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Secondary Branches */}
                    <path
                      d="M40,30 Q50,25 60,35"
                      fill="none"
                      stroke="#5D4037"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20,45 Q25,35 20,25"
                      fill="none"
                      stroke="#5D4037"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    {/* Leaves */}
                    <path
                      d="M50,20 Q55,15 52,10"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M30,35 Q35,30 32,25"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M60,35 Q65,30 68,32"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="1.5"
                    />
                    {/* Flowers */}
                    <circle cx="50" cy="20" r="5" fill="#FF69B4" />{" "}
                    <circle cx="50" cy="20" r="2" fill="#FF1493" />
                    <circle cx="80" cy="5" r="4" fill="#FF69B4" />{" "}
                    <circle cx="80" cy="5" r="1.5" fill="#FF1493" />
                    <circle cx="20" cy="45" r="4" fill="#FF69B4" />{" "}
                    <circle cx="20" cy="45" r="1.5" fill="#FF1493" />
                    <circle cx="60" cy="35" r="3.5" fill="#FF69B4" />{" "}
                    <circle cx="60" cy="35" r="1.2" fill="#FF1493" />
                    <circle cx="20" cy="25" r="3" fill="#FF69B4" />{" "}
                    <circle cx="20" cy="25" r="1" fill="#FF1493" />
                    <circle cx="35" cy="35" r="2.5" fill="#FF69B4" />
                    <circle cx="70" cy="15" r="2.5" fill="#FF69B4" />
                    <circle cx="10" cy="48" r="2" fill="#FF69B4" />
                  </svg>
                </div>
              )}
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
            {settings?.features?.tetCountdown && (
              <Link
                href="/countdown/tet"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Countdown Tết
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Logo */}
        <div className="flex md:hidden flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold relative">
              NhuThangL24
              {isTetOrSpring && (
                <div className="absolute -bottom-3 -right-10 w-20 h-12 pointer-events-none animate-pulse">
                  <svg
                    viewBox="0 0 80 50"
                    className="w-full h-full drop-shadow-sm overflow-visible"
                  >
                    {/* Main Branch */}
                    <path
                      d="M0,50 Q30,40 50,20 T80,5"
                      fill="none"
                      stroke="#5D4037"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Secondary Branches */}
                    <path
                      d="M40,30 Q50,25 60,35"
                      fill="none"
                      stroke="#5D4037"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20,45 Q25,35 20,25"
                      fill="none"
                      stroke="#5D4037"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    {/* Leaves */}
                    <path
                      d="M50,20 Q55,15 52,10"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M30,35 Q35,30 32,25"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M60,35 Q65,30 68,32"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="1.5"
                    />
                    {/* Flowers */}
                    <circle cx="50" cy="20" r="5" fill="#FF69B4" />{" "}
                    <circle cx="50" cy="20" r="2" fill="#FF1493" />
                    <circle cx="80" cy="5" r="4" fill="#FF69B4" />{" "}
                    <circle cx="80" cy="5" r="1.5" fill="#FF1493" />
                    <circle cx="20" cy="45" r="4" fill="#FF69B4" />{" "}
                    <circle cx="20" cy="45" r="1.5" fill="#FF1493" />
                    <circle cx="60" cy="35" r="3.5" fill="#FF69B4" />{" "}
                    <circle cx="60" cy="35" r="1.2" fill="#FF1493" />
                    <circle cx="20" cy="25" r="3" fill="#FF69B4" />{" "}
                    <circle cx="20" cy="25" r="1" fill="#FF1493" />
                    <circle cx="35" cy="35" r="2.5" fill="#FF69B4" />
                    <circle cx="70" cy="15" r="2.5" fill="#FF69B4" />
                    <circle cx="10" cy="48" r="2" fill="#FF69B4" />
                  </svg>
                </div>
              )}
            </span>
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
            {settings?.features?.tetCountdown && (
              <Link
                href="/countdown/tet"
                className="text-sm font-medium transition-colors hover:text-foreground/80 "
              >
                Countdown Tết
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
