import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import FloatingAds from "@/components/FloatingAds";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <FloatingAds />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
