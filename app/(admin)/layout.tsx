import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/admin/LogoutButton";
import { ModeToggle } from "@/components/ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold">
              Admin Dashboard
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/admin/posts">Posts</Link>
              <Link href="/admin/labs">Labs</Link>
              <Link href="/admin/media">Media</Link>
              <Link href="/admin/comments">Comments</Link>
              <Link href="/admin/resume">Resume</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/profile"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {session.user.email}
            </Link>
            <ModeToggle />
            <Link href="/">
              <Button variant="outline" size="sm">
                View Site
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
