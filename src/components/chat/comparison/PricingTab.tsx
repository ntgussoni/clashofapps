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
import { DollarSignIcon } from "lucide-react";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { CalculationDetails } from "@/components/ui/CalculationDetails";
import { ReviewsDialog } from "@/components/ui/ReviewsDialog";
import { getSentimentVariant } from "./utils";
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

interface PricingTabProps {
  comparisonResults: ComparisonResultsData;
}

export function PricingTab({ comparisonResults }: PricingTabProps) {
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
      <div className="border-b border-gray-200 bg-emerald-50/30 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          <DollarSignIcon className="h-4 w-4 text-gray-500" />
          Pricing Perception
          <InfoTooltip
            content={
              <CalculationDetails
                title="Pricing Perception Analysis"
                description="This analysis measures how users perceive the pricing and value of each app based on review sentiment."
                steps={[
                  {
                    description:
                      "Extract pricing-related comments from reviews",
                  },
                  {
                    description:
                      "Calculate sentiment scores for value perception",
                  },
                  { description: "Measure frequency of pricing complaints" },
                  { description: "Assess overall willingness to pay" },
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
                  App
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Value for Money
                  <InfoTooltip
                    content={
                      <CalculationDetails
                        title="Value for Money Score"
                        description="A sentiment score measuring how users perceive the value they get relative to the price they pay."
                        formula="Sum of value sentiment scores / Number of pricing mentions"
                        steps={[
                          {
                            description:
                              "Identify reviews mentioning pricing or value",
                          },
                          {
                            description:
                              "Score each mention from -1 (poor value) to 1 (excellent value)",
                          },
                          {
                            description:
                              "Calculate the average across all mentions",
                          },
                        ]}
                        example={{
                          inputs: {
                            "Positive value mentions": 12,
                            "Negative value mentions": 8,
                          },
                          result: "0.2 (slightly positive)",
                        }}
                        dataSource="User reviews"
                        onViewReviews={() => {
                          console.log("View reviews clicked");
                        }}
                      />
                    }
                    size="sm"
                    className="ml-1"
                  />
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Complaints
                  <InfoTooltip
                    content={
                      <CalculationDetails
                        title="Pricing Complaints Percentage"
                        description="The percentage of reviews that specifically complain about pricing issues."
                        formula="Number of pricing complaints / Total reviews analyzed × 100"
                        example={{
                          inputs: {
                            "Pricing complaints": 15,
                            "Total reviews": 100,
                          },
                          result: "15%",
                        }}
                        dataSource="User reviews"
                      />
                    }
                    size="sm"
                    className="ml-1"
                  />
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Willingness
                  <InfoTooltip
                    content={
                      <CalculationDetails
                        title="Willingness to Pay"
                        description="An assessment of users' overall willingness to pay for the app based on review sentiment."
                        steps={[
                          {
                            description:
                              "Analyze reviews for payment willingness signals",
                          },
                          {
                            description:
                              "Categorize as low, medium, or high based on sentiment patterns",
                          },
                        ]}
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
              {comparisonResults.pricingComparison.map((pricing, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="border-b transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {pricing.appName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <ReviewsDialog
                        appName={pricing.appName}
                        reviews={mapReviewsToReviewItems(
                          comparisonResults.reviews.pricing[pricing.appName],
                        )}
                        title={`${pricing.appName} - Value for Money Reviews`}
                      >
                        <Badge
                          variant={getSentimentVariant(pricing.valueForMoney)}
                          className="w-fit cursor-pointer px-2 py-0.5 text-xs"
                        >
                          {typeof pricing.valueForMoney === "number"
                            ? pricing.valueForMoney.toFixed(2)
                            : Number(pricing.valueForMoney).toFixed(2)}
                        </Badge>
                      </ReviewsDialog>
                      <Progress
                        value={(Number(pricing.valueForMoney) + 1) * 50}
                        className={`h-1.5 ${
                          Number(pricing.valueForMoney) > 0.5
                            ? "bg-emerald-500"
                            : Number(pricing.valueForMoney) < 0
                              ? "bg-red-500"
                              : "bg-amber-500"
                        }`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <ReviewsDialog
                      appName={pricing.appName}
                      reviews={mapReviewsToReviewItems(
                        comparisonResults.reviews.pricing[pricing.appName],
                      )}
                      title={`${pricing.appName} - Pricing Complaint Reviews`}
                    >
                      <span className="cursor-pointer font-medium text-gray-800 underline decoration-dotted underline-offset-4 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                        {typeof pricing.pricingComplaints === "number"
                          ? `${pricing.pricingComplaints}%`
                          : pricing.pricingComplaints}
                      </span>
                    </ReviewsDialog>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-blue-200 bg-blue-50/50 px-2 py-0.5 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      {pricing.willingness}
                    </Badge>
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
