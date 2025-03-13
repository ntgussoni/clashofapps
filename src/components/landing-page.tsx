"use client";

import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "./features-section";
import { CreditInfoSection } from "./credit-info-section";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <CreditInfoSection />
      <FeaturesSection />

      {/* Additional sections can be uncommented when needed */}
      {/* <HowItWorksSection /> */}
      {/* <PricingSection /> */}
    </div>
  );
}
