import React from "react";
import {
  Award,
  CheckCircle,
  Target,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  CheckCircle2Icon,
  AlertCircle,
  LightbulbIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { AnalysisResultsData } from "../types";
import { motion } from "framer-motion";
import { Separator } from "../ui/separator";

interface AnalysisCardProps {
  result: AnalysisResultsData;
  accentColor?: "blue" | "rose";
}

export default function AnalysisCard({
  result,
  accentColor = "blue",
}: AnalysisCardProps) {
  // Format sentiment value for display
  const formatSentiment = (sentiment: string): string => {
    const value = parseFloat(sentiment);
    return value.toFixed(2);
  };

  const colors = {
    blue: "bg-blue-50 border-blue-100",
    rose: "bg-rose-50 border-rose-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-w-[600px] overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div
          className={`border-b border-gray-200 p-6 ${accentColor === "rose" ? "bg-rose-50/30" : "bg-blue-50/30"}`}
        >
          <h3 className="font-semibold text-gray-900">{result.appName}</h3>
        </div>

        <div className="space-y-6 p-6">
          {/* Tabs Navigation */}
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-5 rounded-lg border border-gray-200 bg-gray-50 p-1">
              <TabsTrigger
                value="strengths"
                className="flex items-center gap-1 rounded-md text-xs"
              >
                Strengths
              </TabsTrigger>
              <TabsTrigger
                value="weaknesses"
                className="flex items-center gap-1 rounded-md text-xs"
              >
                Weaknesses
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="flex items-center gap-1 rounded-md text-xs"
              >
                Opportunities
              </TabsTrigger>
              <TabsTrigger
                value="threats"
                className="flex items-center gap-1 rounded-md text-xs"
              >
                Threats
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex items-center gap-1 rounded-md text-xs"
              >
                Features
              </TabsTrigger>
            </TabsList>

            {/* Strengths Tab */}
            <TabsContent value="strengths">
              <div>
                <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
                  <Award className="mr-2 h-4 w-4 text-gray-400" />
                  Key Strengths
                </h4>
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle
                        className={`mr-2 mt-0.5 h-4 w-4 ${accentColor === "rose" ? "text-rose-500" : "text-blue-500"}`}
                      />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Weaknesses Tab */}
            <TabsContent value="weaknesses">
              <div>
                <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
                  <AlertCircle className="mr-2 h-4 w-4 text-gray-400" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <AlertCircle className="mr-2 mt-0.5 h-4 w-4 text-red-500" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities">
              <div>
                <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
                  <LightbulbIcon className="mr-2 h-4 w-4 text-gray-400" />
                  Opportunities
                </h4>
                <ul className="space-y-2">
                  {result.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <LightbulbIcon className="mr-2 mt-0.5 h-4 w-4 text-amber-500" />
                      <span className="text-gray-700">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Threats Tab */}
            <TabsContent value="threats">
              <div>
                <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
                  <AlertCircle className="mr-2 h-4 w-4 text-gray-400" />
                  Threats
                </h4>
                <ul className="space-y-2">
                  {result.threats.map((threat, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <AlertCircle className="mr-2 mt-0.5 h-4 w-4 text-red-500" />
                      <span className="text-gray-700">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features">
              <div>
                <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
                  <Star className="mr-2 h-4 w-4 text-gray-400" />
                  Top Features
                </h4>
                <ul className="space-y-2">
                  {result.topFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start justify-between text-sm"
                    >
                      <div className="flex items-start">
                        <CheckCircle
                          className={`mr-2 mt-0.5 h-4 w-4 ${accentColor === "rose" ? "text-rose-500" : "text-blue-500"}`}
                        />
                        <span className="text-gray-700">{feature.feature}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Badge
                          variant="outline"
                          className="border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700"
                        >
                          {formatSentiment(feature.sentiment)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700"
                        >
                          {feature.mentions} mentions
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          <Separator className="my-4" />
          {/* Market Position Section */}
          <div>
            <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
              <Target className="mr-2 h-4 w-4 text-gray-400" />
              Market Fit
            </h4>
            <p className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600">
              {result.marketPosition}
            </p>
          </div>

          {/* User Demographics Section */}
          <div>
            <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
              <Users className="mr-2 h-4 w-4 text-gray-400" />
              User Demographics
            </h4>
            <p className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600">
              {result.targetDemographic}
            </p>
          </div>

          {/* Pricing Section */}
          <div>
            <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
              <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
              Pricing
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Value</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatSentiment(result.pricing.valueForMoney)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Complaints</p>
                <p className="text-sm font-medium text-gray-900">
                  {result.pricing.pricingComplaints}%
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Perception</p>
                <p className="text-sm font-medium text-gray-900">
                  {result.pricing.willingness}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div>
            <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
              <LightbulbIcon className="mr-2 h-4 w-4 text-gray-400" />
              Recommendations
            </h4>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/10"
                >
                  <div className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium text-gray-900">
                        {rec.action}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {rec.priority} priority • {rec.impact} impact
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
