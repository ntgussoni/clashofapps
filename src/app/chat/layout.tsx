import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, MessageSquareIcon } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App Analysis Chat",
  description: "Chat with our AI to analyze mobile apps",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`flex min-h-screen flex-col ${inter.className}`}>
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-semibold"
            >
              <span className="text-primary">App</span>
              <span>Analysis</span>
            </Link>

            <nav className="hidden items-center gap-4 md:flex">
              <Link href="/" passHref>
                <Button variant="ghost" className="flex items-center gap-2">
                  <HomeIcon className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/chat" passHref>
                <Button variant="ghost" className="flex items-center gap-2">
                  <MessageSquareIcon className="h-4 w-4" />
                  Chat
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" passHref>
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/pricing" passHref>
              <Button>Pricing</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/30">{children}</main>
    </div>
  );
}
