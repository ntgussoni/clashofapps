"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { auth } from "@/server/auth";
import { useRouter } from "next/navigation";
import Logo from "../../public/logo.webp";
import Image from "next/image";
type Session = typeof auth.$Infer.Session;

export function AppHeader({
  initialSession,
}: {
  initialSession: Session | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = authClient.useSession();
  const session = data ?? initialSession;
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const handleMobileSignOut = async () => {
    try {
      await handleSignOut();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent text-primary">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="Clash of apps" width={48} height={48} />
            <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
              Clash<span className="font-light"> of </span> apps
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm font-medium">
                {session.user?.name || session.user?.email}
              </span>
              <Button
                variant="ghost"
                className="text-sm font-medium hover:text-primary"
                onClick={handleSignOut}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm font-medium hover:text-primary"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="flex flex-col gap-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                    </svg>
                    <span className="text-lg font-bold">{siteConfig.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {session ? (
                    <Button
                      variant="ghost"
                      className="justify-start text-sm font-medium hover:text-primary"
                      onClick={handleMobileSignOut}
                    >
                      Log out
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm font-medium hover:text-primary"
                        asChild
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Log in
                        </Link>
                      </Button>
                    </>
                  )}
                </nav>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
