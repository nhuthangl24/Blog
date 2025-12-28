import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <ShieldAlert className="h-24 w-24 text-muted-foreground" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          404
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/posts">View Posts</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
