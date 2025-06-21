"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { extractAppIds } from "@/utils/slug";

export function HeroSection() {
  const router = useRouter();
  const [links, setLinks] = useState<string[]>([""]);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This ensures animations only run after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddLink = () => {
    setLinks([...links, ""]);
    // Clear error when adding a new link
    setError(null);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
    // Clear error when changing links
    setError(null);
  };

  const handleCompare = () => {
    // Reset error state
    setError(null);

    const validLinks = links.filter((link) => link.trim() !== "");

    if (validLinks.length === 0) return;

    // Extract app IDs from the links
    const appIdObjects = extractAppIds(validLinks);
    const appIds = appIdObjects.map((obj) => obj.appId);

    // Check for duplicate app IDs
    const uniqueAppIds = new Set(appIds);

    if (uniqueAppIds.size !== appIds.length) {
      // Find the duplicate app IDs for more helpful error message
      const duplicates = appIds.filter(
        (id, index) => appIds.indexOf(id) !== index,
      );
      const uniqueDuplicates = [...new Set(duplicates)];

      setError(
        `Duplicate app${uniqueDuplicates.length > 1 ? "s" : ""} detected: ${uniqueDuplicates.join(", ")}. Please use unique apps for comparison.`,
      );
      return;
    }

    // Navigate to the analysis create route with app IDs
    router.push(`/analysis/create/${appIds.join("/")}`);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <video
          className="h-full w-full object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          preload="auto"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div className="z-10 h-full w-full before:absolute before:inset-0 before:size-full before:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,.6)_5%,_rgba(255,255,255,1)_60%)] before:content-['']" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-4xl space-y-6 text-center sm:space-y-10">
            {isClient && (
              <>
                <motion.div
                  className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 shadow-sm backdrop-blur-md"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
                  </svg>
                  Testing phase, feedback welcome
                </motion.div>

                <motion.h1
                  className="flex flex-col items-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <motion.span
                    className="block font-black text-zinc-800 shadow-zinc-800/50 drop-shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    Track & Analyze
                  </motion.span>
                  <motion.span
                    className="bg-gradient-to-r from-blue-600 to-cyan-500/90 bg-clip-text pt-2 text-transparent shadow-primary-foreground drop-shadow-lg sm:pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                  >
                    Your App Competitors
                  </motion.span>
                </motion.h1>
              </>
            )}

            {isClient && (
              <motion.p
                className="mx-auto max-w-2xl text-base font-light tracking-tight text-primary sm:text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Enter a{" "}
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-1 ml-2 mr-1 inline-block h-5 fill-primary sm:ml-4 sm:mr-2 sm:h-6"
                >
                  <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
                </svg>
                <span className="mr-2 font-semibold sm:mr-4">Play Store</span>{" "}
                or{" "}
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-1 ml-2 mr-1 inline-block h-5 fill-primary sm:ml-4 sm:mr-2 sm:h-6"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="mr-2 font-semibold sm:mr-4">App Store</span>{" "}
                link to start monitoring your competition
              </motion.p>
            )}

            {isClient && (
              <motion.div
                className="mx-auto w-full max-w-2xl space-y-3 sm:space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {links.map((link, index) => (
                  <Input
                    key={index}
                    placeholder="Example: https://play.google.com/store/apps/details?id=com.example.app"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    className="h-10 border-gray-700 bg-white/10 text-primary backdrop-blur-md placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20 sm:h-12"
                  />
                ))}

                {/* Display error message if it exists */}
                {error && (
                  <motion.div
                    className="mt-2 text-sm font-medium text-red-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div
                  className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Button
                    onClick={handleAddLink}
                    variant="outline"
                    size="lg"
                    className="border-gray-700 bg-white/10 text-primary backdrop-blur-md transition-all hover:bg-white/20 hover:text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Add Another App
                  </Button>

                  <Button
                    onClick={handleCompare}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white transition-all hover:from-emerald-600 hover:to-teal-600"
                  >
                    Compare Apps
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {isClient && (
              <motion.div
                className="pt-4 text-xs text-gray-400 sm:pt-6 sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                Analyze any app from Google Play Store in seconds.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
