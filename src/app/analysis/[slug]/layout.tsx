// Compare layout - this uses the same layout as the main app pages
// but could be customized in the future if needed

import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Compare Apps`,
  description:
    "Compare multiple apps side by side. Analyze metrics, features, and performance to identify competitive advantages.",
  openGraph: {
    title: `${siteConfig.name} - Compare Apps Side by Side`,
    description:
      "Compare multiple apps side by side. Analyze metrics, features, and performance to identify competitive advantages.",
    url: `${siteConfig.url}/compare`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/compare-og.png`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} App Comparison Tool`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Compare Apps Side by Side`,
    description:
      "Compare multiple apps side by side. Analyze metrics, features, and performance to identify competitive advantages.",
    creator: "@clashofapps",
  },
};

export default async function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    const referrer = headersList.get("referrer");
    redirect(referrer ? `login?referrer=${referrer}` : "/login");
  }

  return (
    <>
      <div className="relative flex flex-col">
        <AppHeader initialSession={session} fixed={false} />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
