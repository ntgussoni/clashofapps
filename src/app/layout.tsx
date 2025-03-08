import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { siteConfig } from "@/lib/config";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <TRPCReactProvider>
          {/* The header and main content will be handled by nested layouts when needed */}
          {children}
          {/* Footer is shown on all pages except auth pages */}
        </TRPCReactProvider>
      </body>
      <GoogleAnalytics GA_MEASUREMENT_ID="G-H6YND53W1B" />
    </html>
  );
}
