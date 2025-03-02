"use client"

import { useState } from "react"
import { AppSearch } from "@/components/app-search"
import { ComparisonTable } from "@/components/comparison-table"
import { ReviewInsights } from "@/components/review-insights"
import { AppHeader } from "@/components/app-header"
import type { AppType } from "@/lib/types"

export function AppComparisonDashboard() {
  const [selectedApps, setSelectedApps] = useState<AppType[]>([])

  const handleAddApp = (app: AppType) => {
    if (selectedApps.length < 3 && !selectedApps.some((a) => a.id === app.id)) {
      setSelectedApps([...selectedApps, app])
    }
  }

  const handleRemoveApp = (appId: string) => {
    setSelectedApps(selectedApps.filter((app) => app.id !== appId))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AppHeader />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Compare Apps</h2>
        <AppSearch onSelectApp={handleAddApp} />
      </div>

      {selectedApps.length > 0 ? (
        <>
          <ComparisonTable apps={selectedApps} onRemoveApp={handleRemoveApp} />
          <ReviewInsights apps={selectedApps} />
        </>
      ) : (
        <div className="mt-8 p-8 border border-dashed rounded-lg text-center">
          <p className="text-muted-foreground">Search and select apps above to start comparing</p>
        </div>
      )}
    </div>
  )
}

