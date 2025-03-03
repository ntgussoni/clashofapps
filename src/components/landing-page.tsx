"use client";

import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { PricingSection } from "@/components/pricing-section";
import { Footer } from "@/components/footer";
import { ComparisonSection } from "@/components/comparison-section";
import { siteConfig } from "@/lib/config";
import { BrandIcon } from "@/components/ui/brand-icon";

export function LandingPage() {
  const [isComparing, setIsComparing] = useState(false);
  const [appLinks, setAppLinks] = useState<string[]>([]);

  const handleStartComparison = (links: string[]) => {
    setAppLinks(links);
    setIsComparing(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">{siteConfig.name}</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </a>
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

      <main className="flex-1">
        <HeroSection
          onStartComparison={handleStartComparison}
          isComparing={isComparing}
        />
        {isComparing ? (
          <ComparisonSection appLinks={appLinks} />
        ) : (
          <>
            <FeaturesSection />
            <HowItWorksSection />
            <PricingSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
