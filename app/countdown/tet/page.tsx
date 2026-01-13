"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TetCountdownPage() {
  const { settings, loading } = useSettings();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isNewYear, setIsNewYear] = useState(false);

  // Default values if not set
  const TET_DATE_STR = settings?.features?.tetDate || "2026-02-17T00:00:00+07:00";
  const TITLE = settings?.features?.tetTitle || "Xuân Bính Ngọ 2026";
  const GREETING = settings?.features?.tetGreeting || "Chúc Mừng Năm Mới";

  useEffect(() => {
    // Only run timer if settings are loaded
    if (loading) return;

    const targetDate = new Date(TET_DATE_STR);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsNewYear(true);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
        setIsNewYear(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, TET_DATE_STR]);

  if (loading) return null;

  if (!settings?.features?.tetCountdown) {
    notFound();
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#8B0000] text-[#FFD700]">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Tet Decorations (SVG) */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-60 pointer-events-none">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFD700" d="M45.7,-76.3C58.9,-69.3,69.1,-57.6,76.3,-44.6C83.5,-31.6,87.6,-17.3,86.5,-3.6C85.4,10.1,79.1,23.3,71.1,35.2C63.1,47.1,53.4,57.7,41.9,65.8C30.4,73.9,17.1,79.5,2.9,74.5C-11.3,69.5,-26.4,53.9,-40.3,42.5C-54.2,31.1,-66.9,23.9,-72.6,12.5C-78.3,1.1,-77,-14.5,-69.5,-26.8C-62,-39.1,-48.3,-48.1,-34.7,-54.9C-21.1,-61.7,-7.6,-66.3,6.2,-77.1C20,-87.9,40,-104.9,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" opacity="0.1" />
         </svg>
      </div>
      
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-50">
        <Button 
            variant="outline" 
            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-red-900 bg-red-950/30 backdrop-blur-sm transition-all"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trang chủ
        </Button>
      </Link>

      <div className="relative z-10 w-full max-w-5xl px-4 text-center">
        {isNewYear ? (
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-wider mb-8 text-yellow-400 drop-shadow-[0_4px_15px_rgba(255,215,0,0.5)] animate-pulse">
              {GREETING}
            </h1>
            <h2 className="text-3xl md:text-5xl font-serif text-yellow-200 mt-4">
              Happy New Year!
            </h2>
            <div className="mt-12 text-6xl animate-bounce">
              🎊 🧧 🎇
            </div>
          </div>
        ) : (
          <>
            {/* Animated Main Title */}
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-[0.2em] mb-4 text-yellow-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                ✨ Sắp Đến Tết Rồi ✨
                </h1>
                <h2 className="text-4xl md:text-7xl font-serif text-yellow-200 drop-shadow-lg font-bold">
                {TITLE}
                </h2>
            </div>

            {/* Countdown Timer */}
            {timeLeft ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 my-12">
                <TimeBox value={timeLeft.days} label="Ngày" />
                <TimeBox value={timeLeft.hours} label="Giờ" />
                <TimeBox value={timeLeft.minutes} label="Phút" />
                <TimeBox value={timeLeft.seconds} label="Giây" />
              </div>
            ) : (
              <div className="my-12 h-[200px] flex items-center justify-center">
                 <div className="text-2xl text-yellow-500/50 animate-pulse">Đang tải...</div>
              </div>
            )}
          </>
        )}

        {/* Footer Wishes */}
        <div className="mt-12 space-y-4 animate-fade-in">
             <p className="text-xl md:text-2xl font-serif italic text-yellow-300/90">
                "{GREETING} - Vạn Sự Như Ý"
            </p>
            <div className="flex justify-center gap-4 text-yellow-600/60">
                <span>🌸</span>
                <span>🧧</span>
                <span>🌸</span>
            </div>
        </div>
      </div>
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="group relative">
        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-700"></div>
        <Card className="relative bg-red-900/40 border-2 border-yellow-600/30 backdrop-blur-md overflow-hidden transform transition-all duration-300 hover:border-yellow-500 hover:scale-105 hover:bg-red-900/60 shadow-2xl">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
        <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center min-w-[140px] md:min-w-[180px]">
            <span className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 font-mono mb-2 drop-shadow-sm tabular-nums tracking-tighter loading-none">
            {String(value).padStart(2, "0")}
            </span>
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-yellow-200/80 font-semibold border-t border-yellow-500/30 pt-4 w-full text-center mt-2 group-hover:text-yellow-200 transition-colors">
            {label}
            </span>
        </CardContent>
        </Card>
    </div>
  );
}
