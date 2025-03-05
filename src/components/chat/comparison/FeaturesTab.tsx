import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StarIcon } from "lucide-react";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { CalculationDetails } from "@/components/ui/CalculationDetails";
import { ReviewsDialog } from "@/components/ui/ReviewsDialog";
import { getSentimentVariant, toPercentage } from "./utils";
import type { ComparisonResultsData, ReviewData } from "../../types";

// Interface for ReviewItem to match ReviewsDialog requirements
interface ReviewItem {
  id: string;
  reviewId: string;
  userName: string;
  userImage?: string | null;
  date: string;
  score: number;
  title?: string | null;
  text: string;
  thumbsUp?: number | null;
  version?: string | null;
}

interface FeaturesTabProps {
  comparisonResults: ComparisonResultsData;
}

export function FeaturesTab({ comparisonResults }: FeaturesTabProps) {
  // Helper function to convert ReviewData to ReviewItem
  const mapReviewsToReviewItems = (
    reviews: ReviewData[] = [],
  ): ReviewItem[] => {
    return reviews.map((review) => ({
      id: review.id,
      reviewId: review.id, // Use id as reviewId if not available
      userName: review.userName,
      date: review.date,
      score: review.score,
      text: review.text,
      thumbsUp: null,
      version: null,
    }));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 bg-amber-50/30 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          <StarIcon className="h-4 w-4 text-gray-500" />
          Feature Comparison
          <InfoTooltip
            content={
              <CalculationDetails
                title="Feature Comparison Analysis"
                description="This analysis identifies key features mentioned across apps and measures their sentiment and prevalence."
                steps={[
                  { description: "Extract feature mentions from reviews" },
                  {
                    description:
                      "Calculate sentiment score for each feature (-1 to 1)",
                  },
                  { description: "Count mentions across all apps" },
                  {
                    description:
                      "Calculate app coverage (% of apps with this feature)",
                  },
                ]}
                dataSource="User reviews"
                sampleSize={50}
              />
            }
            size="sm"
          />
        </h3>
      </div>
      <div className="p-6">
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
              <TableRow>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Feature
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  App Coverage
                  <InfoTooltip
                    content={
                      <CalculationDetails
                        title="App Coverage Calculation"
                        description="The percentage of apps in the comparison that have this feature mentioned in reviews."
                        formula="Number of apps with feature / Total number of apps"
                        example={{
                          inputs: { "Apps with feature": 3, "Total apps": 5 },
                          result: "60%",
                        }}
                        dataSource="User reviews"
                      />
                    }
                    size="sm"
                    className="ml-1"
                  />
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Sentiment
                  <InfoTooltip
                    content={
                      <CalculationDetails
                        title="Sentiment Score Calculation"
                        description="The average sentiment score for this feature across all mentions, ranging from -1 (negative) to 1 (positive)."
                        formula="Sum of sentiment scores / Number of mentions"
                        steps={[
                          {
                            description:
                              "Extract sentiment from each review mentioning the feature",
                          },
                          {
                            description:
                              "Score each mention from -1 (negative) to 1 (positive)",
                          },
                          {
                            description:
                              "Calculate the average across all mentions",
                          },
                        ]}
                        example={{
                          inputs: {
                            "Positive mentions": 15,
                            "Neutral mentions": 5,
                            "Negative mentions": 5,
                          },
                          result: "0.4 (moderately positive)",
                        }}
                        dataSource="User reviews"
                      />
                    }
                    size="sm"
                    className="ml-1"
                  />
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Mentions
                  <InfoTooltip
                    content={
                      <CalculationDetails
                        title="Mention Count"
                        description="The total number of times this feature was mentioned across all app reviews."
                        dataSource="User reviews"
                      />
                    }
                    size="sm"
                    className="ml-1"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonResults.featureComparison.map((feature, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="border-b transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {feature.feature}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {toPercentage(feature.appCoverage, 0)}
                      </span>
                      <div className="w-16">
                        <Progress
                          value={feature.appCoverage * 100}
                          className="h-1.5"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ReviewsDialog
                      appName="All Apps"
                      feature={feature.feature}
                      reviews={mapReviewsToReviewItems(
                        comparisonResults.reviews.feature[feature.feature],
                      )}
                      title={`Reviews mentioning "${feature.feature}"`}
                    >
                      <Badge
                        variant={getSentimentVariant(feature.averageSentiment)}
                        className="cursor-pointer px-2 py-0.5 text-xs"
                      >
                        {feature.averageSentiment.toFixed(2)}
                      </Badge>
                    </ReviewsDialog>
                    <div className="mt-1 w-full">
                      <Progress
                        value={(feature.averageSentiment + 1) * 50}
                        className={`h-1.5 ${
                          feature.averageSentiment > 0.5
                            ? "bg-emerald-500"
                            : feature.averageSentiment < 0
                              ? "bg-red-500"
                              : "bg-amber-500"
                        }`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <ReviewsDialog
                      appName="All Apps"
                      feature={feature.feature}
                      reviews={mapReviewsToReviewItems(
                        comparisonResults.reviews.feature[feature.feature],
                      )}
                      title={`Reviews mentioning "${feature.feature}"`}
                    >
                      <span className="cursor-pointer font-medium text-gray-800 underline decoration-dotted underline-offset-4 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                        {feature.totalMentions}
                      </span>
                    </ReviewsDialog>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
