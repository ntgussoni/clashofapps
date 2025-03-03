/**
 * White-Label Configuration
 *
 * This file contains all branding-related configuration.
 * Modify this file to customize the site for your brand.
 */

export const siteConfig = {
  // General site information
  name: "Clash of Apps",
  description: "Track Competitors. Spot Weaknesses. Build a Winning App.",
  copyrightYear: "2024",

  // URLs
  url: "https://clashofapps.com",

  // Contact information
  email: "support@clashofapps.com",

  // Social media profiles
  twitter: "https://twitter.com/clashofapps",
  linkedin: "https://linkedin.com/company/clashofapps",
  github: "https://github.com/clashofapps",

  // Branding elements
  logo: {
    icon: "MessageSquare", // Lucide icon name
    iconColor: "text-yellow-500",
  },

  // Feature flags
  features: {
    darkMode: true,
    newsletter: true,
    socialLinks: true,
  },
};

// Allow type checking when importing this config
export type SiteConfig = typeof siteConfig;
