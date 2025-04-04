import { type Metadata } from "next";
import { api } from "@/trpc/server";
import { siteConfig } from "@/lib/config";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Dashboard`,
  description: "View and manage all your app analyses",
};

export default async function DashboardPage() {
  // Fetch user analyses
  const analyses = await api.analysis.getUserAnalyses();

  return <DashboardContent analyses={analyses} />;
}
