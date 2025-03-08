"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleUser, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";

import { siteConfig } from "@/lib/config";
import { authClient } from "@/lib/auth-client";
import type { auth } from "@/server/auth";

import Logo from "../../public/logo.webp";

type Session = typeof auth.$Infer.Session;

export function AppHeader({
  initialSession,
}: {
  initialSession: Session | null;
}) {
  const { data } = authClient.useSession();
  const session = data ?? initialSession;
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent text-primary">
      <div className="container flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/" className="flex items-center gap-1 sm:gap-2">
            <Image
              src={Logo}
              alt="Clash of apps"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
            />
            <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl">
              Clash<span className="font-light"> of </span> apps
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 md:flex md:gap-6">
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
        <div className="flex items-center gap-2 sm:gap-4">
          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                    aria-label="User menu"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="User avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <CircleUser className="h-6 w-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {session.user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden text-sm font-medium hover:text-primary sm:inline-flex"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                className="hidden h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 sm:inline-flex sm:h-9 sm:px-4 sm:text-sm"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Navigate to different sections of Clash of Apps
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Image
                    src={Logo}
                    alt="Clash of apps"
                    width={32}
                    height={32}
                  />
                  <span className="text-lg font-bold">{siteConfig.name}</span>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {session ? (
                    <>
                      <div className="py-2 text-sm font-medium">
                        {session.user?.name || session.user?.email}
                      </div>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm font-medium hover:text-primary"
                        onClick={handleSignOut}
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm font-medium hover:text-primary"
                        asChild
                      >
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button
                        className="justify-start bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        asChild
                      >
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
