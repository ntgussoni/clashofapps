import React, { useState } from "react";
import {
  Award,
  CheckCircle,
  Target,
  DollarSign,
  Star,
  Users,
  CheckCircle2Icon,
  AlertCircle,
  LightbulbIcon,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { AnalysisResultsData } from "@/components/types";
import { motion } from "framer-motion";
import { Separator } from "../ui/separator";
import { api } from "@/trpc/react";

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

  // State for storing review dialog data
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReviewIds, setSelectedReviewIds] = useState<number[]>([]);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogDescription, setDialogDescription] = useState<string>("");

  // Fetch reviews using TRPC
  const { data: reviews, isLoading } = api.reviews.getReviewsByIds.useQuery(
    { reviewIds: selectedReviewIds },
    { enabled: reviewDialogOpen && selectedReviewIds.length > 0 },
  );

  // Function to handle showing reviews
  const handleShowReviews = (
    title: string,
    description: string,
    reviewIds: number[] = [],
  ) => {
    setDialogTitle(title);
    setDialogDescription(description);
    setSelectedReviewIds(reviewIds);
    setReviewDialogOpen(true);
  };
  console.log(result);
  // Check if review mappings exist
  const hasReviewMappings = result.reviewMappings !== undefined;

  // Helper to get review IDs for a specific strength
  const getStrengthReviewIds = (strength: {
    description: string;
    title: string;
    reviewIds: number[];
  }): number[] => {
    if (!hasReviewMappings) return [];
    return strength.reviewIds;
  };

  // Helper to get review IDs for a specific weakness
  const getWeaknessReviewIds = (weakness: {
    description: string;
    title: string;
    reviewIds: number[];
  }): number[] => {
    if (!hasReviewMappings) return [];
    return weakness.reviewIds;
  };

  const getFeatureReviewIds = (feature: {
    description: string;
    title: string;
    reviewIds: number[];
  }): number[] => {
    if (!hasReviewMappings) return [];
    return feature.reviewIds;
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
                  <Star className="mr-2 h-4 w-4 text-gray-400" />
                  Top Features
                </h4>
                <ul className="space-y-2">
                  {result.topFeatures.map((feature, index) => {
                    const reviewIds = getFeatureReviewIds(feature);
                    const hasReviews = reviewIds?.length > 0;

                    return (
                      <li
                        key={index}
                        className="flex items-start justify-between text-sm"
                      >
                        <div className="flex items-start">
                          <CheckCircle
                            className={`mr-2 mt-0.5 h-4 w-4 ${accentColor === "rose" ? "text-rose-500" : "text-blue-500"}`}
                          />
                          <span className="text-gray-700">{feature.title}</span>
                        </div>

                        {hasReviews && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-6 px-2 text-xs"
                            onClick={() =>
                              handleShowReviews(
                                `Supporting Reviews for: ${feature.title}`,
                                feature.description,
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

      {/* Review Details Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-gray-500">Loading reviews...</p>
                </div>
              ) : !reviews || reviews.length === 0 ? (
                <p className="pt-2 text-sm text-gray-500">
                  No review data available.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-700">{dialogDescription}</p>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="mb-2 flex items-end justify-start">
                        {/* <div className="flex items-center">
                          {review.userImage && (
                            <img
                              src={review.userImage}
                              alt={review.userName}
                              className="mr-2 h-6 w-6 rounded-full"
                            />
                          )}
                          <h3 className="text-sm font-medium text-gray-900">
                            {review.userName}
                          </h3>
                        </div> */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.score
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-gray-200 text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(review.date).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>

                      {review.title && (
                        <p className="mb-1 text-sm font-medium">
                          {review.title}
                        </p>
                      )}

                      <p className="text-sm text-gray-700">{review.text}</p>

                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        {review.version && (
                          <span>Version: {review.version}</span>
                        )}
                        {review.thumbsUp !== undefined &&
                          review.thumbsUp !== null &&
                          review.thumbsUp > 0 && (
                            <span className="flex items-center">
                              <CheckCircle2Icon className="mr-1 h-3 w-3" />
                              {review.thumbsUp}{" "}
                              {review.thumbsUp === 1 ? "person" : "people"}{" "}
                              found this helpful
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
