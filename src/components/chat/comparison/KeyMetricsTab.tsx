import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StarIcon, BarChart3Icon } from "lucide-react";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { CalculationDetails } from "@/components/ui/CalculationDetails";
import { getRatingColorClass } from "./utils";
import type { ComparisonData } from "@/types";

interface KeyMetricsTabProps {
  comparisonResults: ComparisonData;
}

export function KeyMetricsTab({ comparisonResults }: KeyMetricsTabProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 bg-blue-50/30 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          <BarChart3Icon className="h-4 w-4 text-gray-500" />
          App Performance Overview
          <InfoTooltip
            content={
              <CalculationDetails
                title="App Performance Metrics"
                description="These metrics are aggregated from the Google Play Store or App Store and represent the overall performance of each app."
                dataSource="Google Play Store or App Store"
                steps={[
                  {
                    description:
                      "Rating: Average of all user ratings (1-5 stars)",
                  },
                  { description: "Reviews: Total number of user reviews" },
                ]}
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
                  Rating
                  <InfoTooltip
                    content={
                      <CalculationDetails
                        title="App Rating Calculation"
                        description="The average rating is calculated from all user reviews on the Google Play Store or App Store."
                        formula="Sum of all ratings / Number of ratings"
                        example={{
                          inputs: {
                            "Total rating points": 4500,
                            "Number of reviews": 1000,
                          },
                          result: "4.5 stars",
                        }}
                        dataSource="Google Play Store or App Store"
                      />
                    }
                    size="sm"
                    className="ml-1"
                  />
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Reviews
                  <InfoTooltip
                    content={
                      <CalculationDetails
                        title="Review Count"
                        description="The total number of user reviews submitted for this app on the Google Play Store or App Store."
                        dataSource="Google Play Store or App Store"
                      />
                    }
                    size="sm"
                    className="ml-1"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonResults.apps?.map((app, i) => (
                <motion.tr
                  key={app.appId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="border-b transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {app.appName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <StarIcon className="mr-1 h-4 w-4 text-amber-500" />
                      <span
                        className={`font-medium ${getRatingColorClass(
                          Number(app.rating),
                        )}`}
                      >
                        {app.rating}
                      </span>
                    </div>
                    <div className="mt-1 w-full">
                      <Progress
                        value={Math.round((Number(app.rating) / 5) * 100)}
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {app.ratingCount.toLocaleString()}
                    </span>
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
