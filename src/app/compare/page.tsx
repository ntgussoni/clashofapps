"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/ui/brand-icon";
import { siteConfig } from "@/lib/config";

export default function CompareSearchPage() {
  const router = useRouter();
  const [links, setLinks] = useState<string[]>([""]);

  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleCompare = () => {
    // Filter out empty links
    const validLinks = links.filter((link) => link.trim() !== "");

    if (validLinks.length === 0) return;

    // Extract app IDs from the links
    const appIds = validLinks.map((link) => {
      // If it's already an app ID (no slashes or https), return it
      if (!link.includes("/") && !link.includes("https")) {
        return link;
      }

      // If it's a URL, extract the app ID
      try {
        const url = new URL(link);
        const pathParts = url.pathname.split("/");

        // Handle the case where the URL is from the Play Store
        if (url.hostname === "play.google.com") {
          // Format: https://play.google.com/store/apps/details?id=com.example.app
          const params = new URLSearchParams(url.search);
          const appId = params.get("id");
          if (appId) return appId;
        }

        // Try to find the app ID in the path (id might be after /id/ in the path)
        for (let i = 0; i < pathParts.length; i++) {
          if (pathParts[i] === "id" && i + 1 < pathParts.length) {
            return pathParts[i + 1];
          }
        }
      } catch (e) {
        // If URL parsing fails, just return the input as-is
        console.error("Error parsing URL:", e);
      }

      return link; // Return the input as fallback
    });

    // Navigate to the compare route with the app IDs
    router.push(`/compare/${appIds.join("/")}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">{siteConfig.name}</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-primary">
              Log in
            </button>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="mb-8 w-full py-16 text-center sm:py-24">
            <h1 className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl">
              Compare Apps
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
              Enter Google Play Store links or app IDs to compare and analyze
            </p>
            <div className="w-full space-y-4">
              {links.map((link, index) => (
                <Input
                  key={index}
                  placeholder="Paste Google Play Store link here..."
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="w-full border-gray-200 bg-white focus:border-[#01875f] focus:ring-[#01875f]"
                />
              ))}

              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleAddLink}
                  className="group border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another App
                </Button>

                <Button
                  onClick={handleCompare}
                  className="bg-[#01875f] text-white hover:bg-[#017552]"
                >
                  Compare Apps
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try &quot;com.spotify.music, com.apple.music&quot; or
                &quot;Facebook, Instagram, TikTok&quot;
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500 dark:text-gray-400">
          {siteConfig.name} - Compare multiple apps and get insights from Google
          Play reviews
        </div>
      </footer>
    </div>
  );
}
