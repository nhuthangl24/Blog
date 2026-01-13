import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Providers from "@/components/Providers";
import NextTopLoader from "nextjs-toploader";
import SeasonalTheme from "@/components/SeasonalTheme";
import LockdownManager from "@/components/LockdownManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Nhuthangl24 Blog",
  description: "A professional security blog for CVEs, PoCs, and writeups.",
  openGraph: {
    title: "Nhuthangl24 Blog",
    description: "A professional security blog for CVEs, PoCs, and writeups.",
    url: "/",
    siteName: "Nhuthangl24 Blog",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nhuthangl24 Blog",
    description: "A professional security blog for CVEs, PoCs, and writeups.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <Providers>
          <SeasonalTheme />
          <LockdownManager />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
