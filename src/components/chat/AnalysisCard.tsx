import React, { useState } from "react";
import {
  Award,
  CheckCircle,
  Target,
  DollarSign,
  Users,
  AlertCircle,
  LightbulbIcon,
  Info,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Minus,
  MessageSquare,
  ListChecks,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import type { AnalysisResultsData } from "@/types";
import { motion } from "framer-motion";
import { Separator } from "../ui/separator";
import { ReviewsDialog } from "@/components/ui/ReviewsDialog";

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

  // Create a ref for the dialog trigger
  const reviewDialogTriggerRef = React.useRef<HTMLButtonElement>(null);

  // Simplified dialog state
  const [dialogState, setDialogState] = useState({
    title: "",
    description: "",
    reviewIds: [] as number[],
    feature: undefined as string | undefined,
    isOpen: false,
  });

  // Check if review mappings exist
  const hasReviewMappings = result.reviewMappings !== undefined;

  // Function to handle showing reviews
  const handleShowReviews = (
    title: string,
    description: string,
    reviewIds: number[] = [],
    feature?: string,
  ) => {
    setDialogState({
      title,
      description,
      reviewIds,
      feature,
      isOpen: true,
    });

    // Delay trigger click to ensure state is updated
    setTimeout(() => {
      if (reviewDialogTriggerRef.current) {
        reviewDialogTriggerRef.current.click();
      }
    }, 50);
  };

  // Helper to get review IDs for a specific strength
  const getStrengthReviewIds = (strength: {
    description: string;
    title: string;
    reviewIds: number[];
  }): number[] => {
    if (!hasReviewMappings) return [];
    return strength.reviewIds || [];
  };

  // Helper to get review IDs for a specific weakness
  const getWeaknessReviewIds = (weakness: {
    description: string;
    title: string;
    reviewIds: number[];
  }): number[] => {
    if (!hasReviewMappings) return [];
    return weakness.reviewIds || [];
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
                  {result.strengths.map((strength, index) => {
                    const reviewIds = getStrengthReviewIds(strength);
                    const hasReviews = reviewIds?.length > 0;

                    return (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle
                          className={`mr-2 mt-0.5 h-4 w-4 ${accentColor === "rose" ? "text-rose-500" : "text-blue-500"}`}
                        />
                        <span className="text-gray-700">{strength.title}</span>

                        {hasReviews && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-6 px-2 text-xs"
                            onClick={() =>
                              handleShowReviews(
                                `Supporting Reviews for: ${strength.title}`,
                                strength.description,
                                reviewIds,
                              )
                            }
                          >
                            <Info className="mr-1 h-3 w-3" />
                            {reviewIds.length}{" "}
                            {reviewIds.length === 1 ? "review" : "reviews"}
                          </Button>
                        )}
                      </li>
                    );
                  })}
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
                  {result.weaknesses.map((weakness, index) => {
                    const reviewIds = getWeaknessReviewIds(weakness);
                    const hasReviews = reviewIds?.length > 0;

                    return (
                      <li key={index} className="flex items-start text-sm">
                        <AlertCircle className="mr-2 mt-0.5 h-4 w-4 text-red-500" />
                        <span className="text-gray-700">{weakness.title}</span>

                        {hasReviews && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-6 px-2 text-xs"
                            onClick={() =>
                              handleShowReviews(
                                `Supporting Reviews for: ${weakness.title}`,
                                weakness.description,
                                reviewIds,
                              )
                            }
                          >
                            <Info className="mr-1 h-3 w-3" />
                            {reviewIds.length}{" "}
                            {reviewIds.length === 1 ? "review" : "reviews"}
                          </Button>
                        )}
                      </li>
                    );
                  })}
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
                  <ListChecks className="mr-2 h-4 w-4 text-gray-400" />
                  Key Features
                </h4>
                <div className="space-y-3">
                  <ul className="space-y-1">
                    {result.keyFeatures.map((feature, index: number) => {
                      const reviewIds = feature.reviewIds || [];
                      const hasReviews = reviewIds.length > 0;

                      // Get sentiment color and icon
                      let sentimentColor = "text-gray-400";
                      let SentimentIcon = Info;

                      switch (feature.sentiment) {
                        case "positive":
                          sentimentColor = "text-green-500";
                          SentimentIcon = ThumbsUp;
                          break;
                        case "negative":
                          sentimentColor = "text-red-500";
                          SentimentIcon = ThumbsDown;
                          break;
                        case "mixed":
                          sentimentColor = "text-amber-500";
                          SentimentIcon = HelpCircle;
                          break;
                        case "neutral":
                        default:
                          sentimentColor = "text-gray-400";
                          SentimentIcon = Minus;
                          break;
                      }

                      return (
                        <li
                          key={index}
                          className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3"
                        >
                          <div className="flex items-start">
                            <CheckCircle
                              className={`mr-2 mt-0.5 h-4 w-4 ${accentColor === "rose" ? "text-rose-500" : "text-blue-500"}`}
                            />
                            <div className="flex flex-col">
                              <span className="text-gray-700">
                                {feature.feature}
                              </span>
                              {feature.description && (
                                <span className="mt-1 text-xs text-gray-500">
                                  {feature.description}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="mr-3 flex items-center">
                              <SentimentIcon
                                className={`h-4 w-4 ${sentimentColor}`}
                              />
                              <span
                                className={`ml-1 text-xs ${sentimentColor}`}
                              >
                                {feature.sentiment.charAt(0).toUpperCase() +
                                  feature.sentiment.slice(1)}
                              </span>
                            </div>

                            {hasReviews && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() =>
                                  handleShowReviews(
                                    `Supporting Reviews for: ${feature.feature}`,
                                    feature.feature,
                                    reviewIds,
                                    feature.feature,
                                  )
                                }
                              >
                                <MessageSquare className="mr-1 h-3 w-3" />
                                {reviewIds.length}{" "}
                                {reviewIds.length === 1 ? "review" : "reviews"}
                              </Button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
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

      {/* Updated ReviewsDialog with new props */}
      <ReviewsDialog
        appName={result.appName}
        feature={dialogState.feature}
        reviewIds={dialogState.reviewIds}
        title={dialogState.title}
        description={dialogState.description}
      >
        <button
          ref={reviewDialogTriggerRef}
          className="hidden"
          type="button"
          aria-hidden="true"
        >
          Trigger
        </button>
      </ReviewsDialog>
    </motion.div>
  );
}
