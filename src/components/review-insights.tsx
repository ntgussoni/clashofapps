"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AppType } from "@/lib/types"
import { SentimentChart } from "@/components/sentiment-chart"
import { KeywordCloud } from "@/components/keyword-cloud"
import { ReviewTimeline } from "@/components/review-timeline"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReviewInsightsProps {
  apps: AppType[]
}

export function ReviewInsights({ apps }: ReviewInsightsProps) {
  const [selectedAppId, setSelectedAppId] = useState<string>(apps[0]?.id || "")

  const selectedApp = apps.find((app) => app.id === selectedAppId) || apps[0]

  if (!selectedApp) return null

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Review Insights</h2>
        {apps.length > 1 && (
          <Select value={selectedAppId} onValueChange={setSelectedAppId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select app" />
            </SelectTrigger>
            <SelectContent>
              {apps.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs defaultValue="sentiment">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
          <TabsTrigger value="timeline">Rating Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Overall Sentiment</CardTitle>
                <CardDescription>Distribution of review sentiments</CardDescription>
              </CardHeader>
              <CardContent>
                <SentimentChart app={selectedApp} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>What users are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedApp.reviewInsights.map((insight, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            insight.sentiment === "positive"
                              ? "bg-green-500"
                              : insight.sentiment === "negative"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <span className="font-medium capitalize">{insight.sentiment} Insight</span>
                      </div>
                      <p className="text-sm">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Common Keywords</CardTitle>
              <CardDescription>Frequently mentioned terms in reviews</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <KeywordCloud app={selectedApp} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Rating Trends</CardTitle>
              <CardDescription>How ratings have changed over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ReviewTimeline app={selectedApp} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

