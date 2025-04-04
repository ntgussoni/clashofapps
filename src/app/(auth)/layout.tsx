// Auth layout - we don't want to show the main header and footer here
// The (auth) folder name with parentheses is a Next.js convention for route groups
// that don't affect the URL path

import { type Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Authentication`,
  description: "Log in or sign up to access all the features of Clash of Apps",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We're returning just the children without any additional layout elements
  // The header and footer from the root layout won't be shown here
  return <>{children}</>;
}
