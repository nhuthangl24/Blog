"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
        {t("hero.title")}
      </h1>
      <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
        {t("hero.subtitle")}
      </p>
      <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
        <Link href="/posts">
          <Button size="lg">{t("hero.browsePosts")}</Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" size="lg">
            {t("hero.aboutMe")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
