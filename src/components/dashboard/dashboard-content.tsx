"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyDashboard } from "./empty-dashboard";
import { AppCard } from "./app-card";

// Placeholder image to use when app icon is not available

interface AppData {
  id?: number;
  appStoreId?: string;
  name?: string;
  icon?: string | null;
}

interface Analysis {
  id: number;
  slug: string;
  apps: AppData[];
  createdAt: Date;
}

interface DashboardContentProps {
  analyses: Analysis[];
}

export function DashboardContent({ analyses }: DashboardContentProps) {
  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Comparisons</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all your app comparisons
          </p>
        </div>
        <Link href="/new-analysis">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Comparison
          </Button>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis) => (
            <AppCard key={analysis.id.toString()} analysis={analysis} />
          ))}
        </div>
      )}
    </div>
  );
}
