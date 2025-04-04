import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StarIcon, DollarSignIcon, BarChart3Icon } from "lucide-react";
import { KeyMetricsTab } from "./comparison/KeyMetricsTab";
import { FeaturesTab } from "./comparison/FeaturesTab";
import { PricingTab } from "./comparison/PricingTab";
import { RecommendationsSection } from "./comparison/RecommendationsSection";
import type { ComparisonData } from "@/types";

interface ComparisonSectionProps {
  comparisonResults: ComparisonData;
}

export default function ComparisonSection({
  comparisonResults,
}: ComparisonSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6 w-full"
    >
      <Card className="overflow-hidden border shadow-md">
        <CardHeader className="border-b border-gray-200 bg-blue-50/30 p-6 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <BarChart3Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Cross-App Comparison
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="rounded-full px-3 py-1">
                    Comparative Analysis
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Based on aggregated user reviews across multiple apps</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comprehensive comparison of key metrics across competing apps
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3 rounded-lg border border-gray-200 bg-gray-50 p-1">
              <TabsTrigger
                value="metrics"
                className="flex items-center gap-1 rounded-md"
              >
                <BarChart3Icon className="h-4 w-4 text-blue-500" />
                Key Metrics
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex items-center gap-1 rounded-md"
              >
                <StarIcon className="h-4 w-4 text-amber-500" />
                Features
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="flex items-center gap-1 rounded-md"
              >
                <DollarSignIcon className="h-4 w-4 text-emerald-500" />
                Pricing
              </TabsTrigger>
            </TabsList>

            {/* Key Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              <KeyMetricsTab comparisonResults={comparisonResults} />
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-4">
              <FeaturesTab comparisonResults={comparisonResults} />
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-4">
              <PricingTab comparisonResults={comparisonResults} />
            </TabsContent>
          </Tabs>

          {/* Recommendations */}
          <RecommendationsSection
            recommendations={comparisonResults.recommendationSummary}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
