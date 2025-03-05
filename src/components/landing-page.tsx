"use client";

import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { PricingSection } from "@/components/pricing-section";

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
      </main>
    </div>
  );
}
