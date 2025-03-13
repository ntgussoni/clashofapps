import { AppHeader } from "@/components/app-header";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { type Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Home`,
  description:
    "Compare and analyze your app's competitors. Get insights to improve your app's performance and user engagement.",
  openGraph: {
    title: `${siteConfig.name} - Track Competitors and Build a Winning App`,
    description:
      "Compare apps, track competitors, and spot weaknesses to build a better product.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Track Competitors and Build a Winning App`,
    description:
      "Compare apps, track competitors, and spot weaknesses to build a better product.",
    creator: "@clashofapps",
  },
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      <AppHeader initialSession={session} fixed={false} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
