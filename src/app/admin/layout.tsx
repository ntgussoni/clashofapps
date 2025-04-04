// Admin layout - we want to show a specialized header for admin pages
// but still use the footer from the root layout

import { AppHeader } from "@/components/app-header";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Admin Dashboard`,
  description: "Administrative dashboard for Clash of Apps.",
  robots: {
    index: false,
    follow: false,
  },
  other: {
    "cache-control": "no-store, max-age=0",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <AppHeader initialSession={session} />
        <main className="mt-16 flex-1">{children}</main>
      </div>
    </>
  );
}
