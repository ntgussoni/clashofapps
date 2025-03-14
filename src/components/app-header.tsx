"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleUser, Menu, Coins } from "lucide-react";
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
  SheetHeader,
} from "@/components/ui/sheet";

import { siteConfig } from "@/lib/config";
import { authClient } from "@/lib/auth-client";
import type { auth } from "@/server/auth";

import Logo from "../../public/logo.webp";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { api } from "@/trpc/react";

type Session = typeof auth.$Infer.Session;

export function AppHeader({
  initialSession,
  fixed = true,
}: {
  initialSession: Session | null;
  fixed?: boolean;
}) {
  const { data } = authClient.useSession();
  const session = data ?? initialSession;
  const router = useRouter();

  // Use tRPC query for credits
  const { data: credits, isLoading } = api.credits.getMyCredits.useQuery(
    undefined,
    {
      // Only fetch if logged in
      enabled: !!session?.user?.id,
      // Refresh every minute
      refetchInterval: 60 * 1000,
    },
  );

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const navigation: { name: string; href: string }[] = [
    // { name: "Features", href: "#features" },
    // { name: "How It Works", href: "#how-it-works" },
    // { name: "Pricing", href: "#pricing" },
    { name: "App Analyses", href: "/google-play/app-analyses" },
  ];

  const loggedInNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "App Analyses", href: "/google-play/app-analyses" },
    // { name: "New Comparison", href: "/new-analysis" },
  ];

  return (
    <header
      className={cn(
        "top-0 z-50 w-full bg-transparent text-primary",
        fixed ? "fixed" : "relative",
      )}
    >
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
            <span className="hidden bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-lg font-extrabold tracking-tight text-transparent shadow-black drop-shadow-sm sm:text-xl md:inline-block">
              CLASH<span className="font-light"> of </span> APPS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Now properly centered */}
        <nav className="hidden items-center justify-center gap-4 md:flex md:gap-6">
          {session ? (
            <>
              {loggedInNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </>
          ) : (
            <>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center justify-end gap-2 sm:gap-4">
          {session ? (
            <>
              {/* Credits Display */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-sm font-medium text-orange-800">
                      <Coins className="h-4 w-4" />
                      <span>{isLoading ? "..." : (credits ?? 0)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Available credits for app analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

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
                  {/* <DropdownMenuItem asChild>
                    <Link href="/credits">Buy Credits</Link>
                  </DropdownMenuItem> */}
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
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Image
                      src={Logo}
                      alt="Clash of apps"
                      width={32}
                      height={32}
                    />
                    <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-lg font-extrabold tracking-tight text-transparent shadow-black drop-shadow-sm">
                      CLASH<span className="font-light"> of </span> APPS
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                <nav className="flex flex-col space-y-4">
                  {session ? (
                    <>
                      {loggedInNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      ))}
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
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <Button
                        variant="ghost"
                        className="justify-start text-sm font-medium hover:text-primary"
                        asChild
                      >
                        <Link href="/login">Log in</Link>
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
