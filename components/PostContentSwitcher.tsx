"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

interface PostContentSwitcherProps {
  contentEn: ReactNode;
  contentVi?: ReactNode;
  contentZh?: ReactNode;
}

export default function PostContentSwitcher({
  contentEn,
  contentVi,
  contentZh,
}: PostContentSwitcherProps) {
  const { language } = useLanguage();

  if (language === "vi" && contentVi) {
    return <>{contentVi}</>;
  }

  if (language === "zh" && contentZh) {
    return <>{contentZh}</>;
  }

  return <>{contentEn}</>;
}
