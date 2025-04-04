/**
 * White-Label Configuration
 *
 * This file contains all branding-related configuration.
 * Modify this file to customize the site for your brand.
 */

export const siteConfig = {
  // General site information
  name: "Clash of Apps",
  description: "Track & Analyze Your App Competitors",
  copyrightYear: new Date().getFullYear(),

  // URLs
  url: "https://clashofapps.com",

  // Contact information
  email: "hey@clashofapps.com",

  // Social media profiles
  twitter: "https://twitter.com/ntorresdev",
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
    newsletter: false,
    socialLinks: false,
  },
};

// Allow type checking when importing this config
export type SiteConfig = typeof siteConfig;
