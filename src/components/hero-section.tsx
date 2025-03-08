"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const router = useRouter();
  const [links, setLinks] = useState<string[]>([""]);
  const [isClient, setIsClient] = useState(false);

  // This ensures animations only run after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleCompare = () => {
    const validLinks = links.filter((link) => link.trim() !== "");

    if (validLinks.length === 0) return;

    const appIds = links.map((link) => {
      if (!link.includes("/") && !link.includes("https")) {
        return link;
      }

      try {
        const url = new URL(link);
        const pathParts = url.pathname.split("/");

        if (url.hostname === "play.google.com") {
          const params = new URLSearchParams(url.search);
          const appId = params.get("id");
          if (appId) return appId;
        }

        for (let i = 0; i < pathParts.length; i++) {
          if (pathParts[i] === "id" && i + 1 < pathParts.length) {
            return pathParts[i + 1];
          }
        }
      } catch (e) {
        console.error("Error parsing URL:", e);
      }

      return link;
    });

    router.push(`/compare/${appIds.join("/")}`);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          preload="auto"
        >
          <source src="/video.webm" type="video/webm" />
        </video>
        <div className="z-10 h-full w-full before:absolute before:inset-0 before:size-full before:bg-[radial-gradient(circle_at_center,_rgba(10,10,10,.3)_15%,_rgba(10,10,10,1)_45%)] before:content-['']" />
      </div>

      {/* Animated Background Elements */}
      {isClient && (
        <>
          <motion.div
            className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}

      {/* Hero Content */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl space-y-10 text-center">
            {isClient && (
              <motion.h1
                className="flex flex-col items-center text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Skip Years of Feature Experimentation
                </motion.span>
                <motion.span
                  className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text pt-4 text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  Build What Users Already Want
                </motion.span>
              </motion.h1>
            )}

            {isClient && (
              <motion.p
                className="mx-auto max-w-2xl text-lg font-light tracking-tight text-gray-300 md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Stop guessing what users want · See precisely why people love or
                abandon your competitors&apos; apps · Enter{" "}
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-1 ml-4 mr-2 inline-block h-6 fill-white"
                >
                  <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
                </svg>
                <span className="mr-4 font-semibold">Google Play Store</span>{" "}
                links and get instant insights on which features to prioritize
                and which flaws to avoid in your development.
              </motion.p>
            )}

            {isClient && (
              <motion.div
                className="mx-auto w-full max-w-2xl space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {links.map((link, index) => (
                  <Input
                    key={index}
                    placeholder="Paste Google Play Store link here..."
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    className="h-12 border-gray-700 bg-white/10 text-white backdrop-blur-md placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                ))}

                <motion.div
                  className="flex flex-col justify-center gap-4 sm:flex-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Button
                    onClick={handleAddLink}
                    variant="outline"
                    className="h-12 border-gray-700 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Another App
                  </Button>

                  <Button
                    onClick={handleCompare}
                    className="h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white transition-all hover:from-emerald-600 hover:to-teal-600"
                  >
                    Compare Apps
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {isClient && (
              <motion.div
                className="pt-6 text-sm text-gray-400"
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
