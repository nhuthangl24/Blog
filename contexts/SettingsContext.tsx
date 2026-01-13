"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Settings {
  announcement?: {
    enabled: boolean;
    content: string;
    link: string;
  };
  ads?: {
    enabled: boolean;
    [key: string]: any;
  };
  theme?: {
    mode: string;
    allowUserToggle: boolean;
  };
  features?: {
    tetCountdown: boolean;
    tetDate?: string;
    tetTitle?: string;
    tetGreeting?: string;
    lockdown?: {
      enabled: boolean;
      startBeforeMinutes: number; // Minutes before Tet to start locking
      endAfterMinutes: number;   // Minutes after Tet to return to normal
    };
  };
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
