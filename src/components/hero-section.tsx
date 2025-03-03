"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onStartComparison: (links: string[]) => void;
  isComparing: boolean;
}

export function HeroSection({
  onStartComparison,
  isComparing,
}: HeroSectionProps) {
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
    onStartComparison(links);
  };

  return (
    <section className="relative py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center space-y-8 text-center">
          <div className="inline-flex items-center rounded-full bg-[#E8F5E9] px-3 py-1 text-sm text-[#01875f]">
            AI-Powered App Analysis
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Turn Competitor Flaws{" "}
            <span className="text-[#4285F4]">into Your Winning Features.</span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            Paste Google Play Store links below and let our AI analyze and
            compare the apps for you.
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
          </div>
        </div>
      </div>
    </section>
  );
}
