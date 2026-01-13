"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";

const ITEM_COUNT = 30;

type Season = "tet" | "spring" | "summer" | "autumn" | "winter" | "default";

function getAutoSeason(): Season {
  const month = new Date().getMonth() + 1; // 1-12
  
  // Simple approximation
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter"; // 12, 1, 2
}

export default function SeasonalTheme() {
  const { settings } = useSettings();
  const themeConfig = settings?.theme || {};
  
  // Determine effective mode
  // If type is 'auto', calculate season. Otherwise use manual 'mode'.
  // Fallback to 'manual' if type is missing (backward compatibility)
  const type = (themeConfig as any).type || 'manual';
  const manualMode = themeConfig.mode as Season || 'default';
  
  const [mode, setMode] = useState<Season>("default");
  const [items, setItems] = useState<Array<{ id: number; left: string; delay: string; duration: string; type: string }>>([]);

  useEffect(() => {
    let effectiveMode = manualMode;
    if (type === 'auto') {
      effectiveMode = getAutoSeason();
    }
    setMode(effectiveMode);
  }, [type, manualMode]);

  useEffect(() => {
    // Reset classes
    document.body.classList.remove("tet-theme", "spring-theme", "summer-theme", "autumn-theme", "winter-theme");
    
    if (!mode || mode === "default") {
      setItems([]);
      return;
    }

    document.body.classList.add(`${mode}-theme`);

    // Generate falling items based on season
    const newItems = Array.from({ length: ITEM_COUNT }).map((_, i) => {
      let type = "default";
      const rand = Math.random();

      if (mode === "tet") {
        if (rand > 0.8) type = 'envelope';
        else if (rand > 0.6) type = 'coin';
        else if (rand > 0.4) type = 'apricot';
        else type = 'peach';
      } else if (mode === "spring") {
        type = rand > 0.5 ? 'flower-pink' : 'flower-white';
      } else if (mode === "summer") {
        type = 'sun-ray'; // Or maybe just clear sky, less falling items?
      } else if (mode === "autumn") {
        type = rand > 0.5 ? 'leaf-orange' : 'leaf-brown';
      } else if (mode === "winter") {
        type = 'snowflake';
      }

      return {
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${5 + Math.random() * 10}s`,
        type
      };
    });
    setItems(newItems);

    return () => {
      document.body.classList.remove(`${mode}-theme`);
    };
  }, [mode]);

  if (!mode || mode === "default") return null;

  return (
    <div className="seasonal-decorations pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Falling Items */}
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute -top-8 w-6 h-6 animate-fall"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {renderItem(item.type)}
        </div>
      ))}

      {/* Static Decorations */}
      {renderStaticDecorations(mode)}
    </div>
  );
}

function renderItem(type: string) {
  switch (type) {
    case 'envelope':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
          <rect x="2" y="4" width="20" height="16" rx="2" fill="#d32f2f" />
          <path d="M2 4 L12 14 L22 4" stroke="#ffeb3b" strokeWidth="1" fill="none" />
          <circle cx="12" cy="14" r="2" fill="#ffeb3b" />
        </svg>
      );
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md animate-spin-slow">
          <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
          <rect x="8" y="8" width="8" height="8" fill="none" stroke="#B8860B" strokeWidth="1" />
        </svg>
      );
    case 'peach':
      return (
        <svg viewBox="0 0 24 24" fill="#ffb7b2" className="w-full h-full drop-shadow-sm opacity-80">
          <path d="M12 2C12 2 14 8 18 8C22 8 20 12 20 12C20 12 22 16 18 18C14 20 12 22 12 22C12 22 10 20 6 18C2 16 4 12 4 12C4 12 2 8 6 8C10 8 12 2 12 2Z" />
        </svg>
      );
    case 'apricot':
      return (
        <svg viewBox="0 0 24 24" fill="#ffd700" className="w-full h-full drop-shadow-sm opacity-80">
          <path d="M12 2C12 2 14 8 18 8C22 8 20 12 20 12C20 12 22 16 18 18C14 20 12 22 12 22C12 22 10 20 6 18C2 16 4 12 4 12C4 12 2 8 6 8C10 8 12 2 12 2Z" />
        </svg>
      );
    case 'flower-pink':
      return (
        <svg viewBox="0 0 24 24" fill="#ff69b4" className="w-full h-full drop-shadow-sm opacity-80">
           <circle cx="12" cy="12" r="4" fill="#ffff00" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(0 12 12)" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(72 12 12)" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(144 12 12)" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(216 12 12)" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(288 12 12)" />
        </svg>
      );
    case 'flower-white':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-full h-full drop-shadow-sm opacity-80">
           <circle cx="12" cy="12" r="4" fill="#ffff00" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(0 12 12)" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(72 12 12)" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(144 12 12)" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(216 12 12)" />
           <path d="M12 2 C14 2 16 6 16 8 C16 10 14 12 12 12 C10 12 8 10 8 8 C8 6 10 2 12 2 Z" transform="rotate(288 12 12)" />
        </svg>
      );
    case 'sun-ray':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full opacity-60">
          <circle cx="12" cy="12" r="4" fill="#FFD54F" />
          <path d="M12 2 L12 4 M12 20 L12 22 M2 12 L4 12 M20 12 L22 12 M5 5 L7 7 M17 17 L19 19 M5 19 L7 17 M17 7 L19 5" stroke="#FFD54F" strokeWidth="2" />
        </svg>
      );
    case 'leaf-orange':
      return (
        <svg viewBox="0 0 24 24" fill="#e65100" className="w-full h-full drop-shadow-sm opacity-80">
          <path d="M12 2 C12 2 20 10 20 16 C20 20 16 22 12 22 C8 22 4 20 4 16 C4 10 12 2 12 2 Z" />
          <path d="M12 2 L12 22" stroke="#bf360c" strokeWidth="1" />
        </svg>
      );
    case 'leaf-brown':
      return (
        <svg viewBox="0 0 24 24" fill="#795548" className="w-full h-full drop-shadow-sm opacity-80">
          <path d="M12 2 C12 2 20 10 20 16 C20 20 16 22 12 22 C8 22 4 20 4 16 C4 10 12 2 12 2 Z" />
          <path d="M12 2 L12 22" stroke="#3e2723" strokeWidth="1" />
        </svg>
      );
    case 'snowflake':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#b3e5fc" strokeWidth="2" className="w-full h-full drop-shadow-sm opacity-80">
          <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5" />
        </svg>
      );
    default:
      return null;
  }
}

function renderStaticDecorations(mode: Season) {
  switch (mode) {
    case "tet":
      return (
        <>
          {/* Left Lantern */}
          <div className="absolute top-0 left-20 md:left-32 w-16 h-24 md:w-20 md:h-32 animate-swing origin-top z-20 hidden md:block">
            <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-xl filter">
              <path d="M50 0 L50 20" stroke="#d4af37" strokeWidth="2" />
              <path d="M20 20 L80 20 L90 40 L90 90 L80 110 L20 110 L10 90 L10 40 Z" fill="#D32F2F" stroke="#d4af37" strokeWidth="2" />
              <path d="M50 110 L50 140" stroke="#d4af37" strokeWidth="2" />
              <circle cx="50" cy="140" r="5" fill="#d4af37" />
            </svg>
          </div>
          
          {/* Right Lantern */}
          <div className="absolute top-0 right-20 md:right-32 w-16 h-24 md:w-20 md:h-32 animate-swing origin-top delay-1000 z-20 hidden md:block">
            <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-xl filter">
              <path d="M50 0 L50 20" stroke="#d4af37" strokeWidth="2" />
              <path d="M20 20 L80 20 L90 40 L90 90 L80 110 L20 110 L10 90 L10 40 Z" fill="#D32F2F" stroke="#d4af37" strokeWidth="2" />
              <path d="M50 110 L50 140" stroke="#d4af37" strokeWidth="2" />
              <circle cx="50" cy="140" r="5" fill="#d4af37" />
            </svg>
          </div>

          {/* Corner Apricot Blossom (Mai Vàng) - Top Left */}
          <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none z-0 opacity-90 hidden md:block">
             <svg viewBox="0 0 200 200" className="w-full h-full">
               <path d="M0 0 Q 50 50 100 20 T 180 80" stroke="#5D4037" strokeWidth="3" fill="none" />
               <path d="M50 25 Q 60 60 30 80" stroke="#5D4037" strokeWidth="2" fill="none" />
               
               {/* Flowers */}
               <g transform="translate(40, 30)">
                 <circle r="8" fill="#FFD700" />
                 <circle r="3" fill="#FF6F00" />
               </g>
               <g transform="translate(80, 40)">
                 <circle r="10" fill="#FFD700" />
                 <circle r="4" fill="#FF6F00" />
               </g>
               <g transform="translate(120, 30)">
                 <circle r="7" fill="#FFD700" />
                 <circle r="2" fill="#FF6F00" />
               </g>
               <g transform="translate(160, 70)">
                 <circle r="9" fill="#FFD700" />
                 <circle r="3" fill="#FF6F00" />
               </g>
               <g transform="translate(30, 80)">
                 <circle r="6" fill="#FFD700" />
                 <circle r="2" fill="#FF6F00" />
               </g>
             </svg>
          </div>

          {/* Corner Peach Blossom (Hoa Đào) - Top Right */}
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none z-0 opacity-90 hidden md:block transform scale-x-[-1]">
             <svg viewBox="0 0 200 200" className="w-full h-full">
               <path d="M0 0 Q 50 50 100 20 T 180 80" stroke="#5D4037" strokeWidth="3" fill="none" />
               <path d="M50 25 Q 60 60 30 80" stroke="#5D4037" strokeWidth="2" fill="none" />
               
               {/* Flowers */}
               <g transform="translate(40, 30)">
                 <circle r="8" fill="#FF80AB" />
                 <circle r="3" fill="#C51162" />
               </g>
               <g transform="translate(80, 40)">
                 <circle r="10" fill="#FF80AB" />
                 <circle r="4" fill="#C51162" />
               </g>
               <g transform="translate(120, 30)">
                 <circle r="7" fill="#FF80AB" />
                 <circle r="2" fill="#C51162" />
               </g>
               <g transform="translate(160, 70)">
                 <circle r="9" fill="#FF80AB" />
                 <circle r="3" fill="#C51162" />
               </g>
               <g transform="translate(30, 80)">
                 <circle r="6" fill="#FF80AB" />
                 <circle r="2" fill="#C51162" />
               </g>
             </svg>
          </div>
        </>
      );
    case "spring":
      return (
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none z-10 opacity-90">
           <svg viewBox="0 0 200 200" className="w-full h-full">
             <path d="M200 0 Q 100 50 50 150" stroke="#5D4037" strokeWidth="3" fill="none" />
             <circle cx="180" cy="20" r="10" fill="#F48FB1" />
             <circle cx="150" cy="40" r="12" fill="#F8BBD0" />
             <circle cx="120" cy="80" r="8" fill="#F48FB1" />
             <circle cx="80" cy="120" r="10" fill="#F8BBD0" />
           </svg>
        </div>
      );
    case "summer":
      return (
        <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none z-10 opacity-60">
           <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
             <circle cx="200" cy="0" r="60" fill="#FFD54F" />
             <path d="M200 0 L100 100 M200 0 L50 50 M200 0 L0 200" stroke="#FFD54F" strokeWidth="4" opacity="0.5" />
           </svg>
        </div>
      );
    case "autumn":
      return (
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none z-10 opacity-80">
           <svg viewBox="0 0 200 200" className="w-full h-full">
             <path d="M200 0 Q 150 50 100 0" stroke="#5D4037" strokeWidth="2" fill="none" />
             <path d="M180 20 L160 50 L190 60 Z" fill="#E64A19" />
             <path d="M140 10 L120 40 L150 30 Z" fill="#FF7043" />
           </svg>
        </div>
      );
    case "winter":
      return (
        <div className="absolute top-0 w-full h-8 pointer-events-none z-10 opacity-80">
           <svg viewBox="0 0 1000 50" preserveAspectRatio="none" className="w-full h-full">
             <path d="M0 0 L1000 0 L1000 10 Q 900 30 800 10 Q 700 40 600 10 Q 500 30 400 10 Q 300 40 200 10 Q 100 30 0 10 Z" fill="#E1F5FE" />
           </svg>
        </div>
      );
    default:
      return null;
  }
}
