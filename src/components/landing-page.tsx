"use client";

import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "./features-section";
// import { HowItWorksSection } from "./how-it-works-section";
// import { PricingSection } from "./pricing-section";
// import { FeaturesSection } from "@/components/features-section";
// import { HowItWorksSection } from "@/components/how-it-works-section";
// import { PricingSection } from "@/components/pricing-section";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />

      {/* Additional sections can be uncommented when needed */}
      <FeaturesSection />
      {/* <HowItWorksSection /> */}
      {/* <PricingSection /> */}
    </div>
  );
}
