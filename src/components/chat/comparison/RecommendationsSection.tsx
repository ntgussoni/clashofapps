import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { CalculationDetails } from "@/components/ui/CalculationDetails";
import { LightbulbIcon } from "lucide-react";
import type { ComparisonResultsData } from "../../types";

interface RecommendationsSectionProps {
  comparisonResults: ComparisonResultsData;
}

export function RecommendationsSection({
  comparisonResults,
}: RecommendationsSectionProps) {
  return (
    <Card className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200 bg-amber-50/30 px-6 py-6 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-amber-400">
            <LightbulbIcon className="h-5 w-5 text-amber-500" />
            Action Plan for Success
            <InfoTooltip
              content={
                <CalculationDetails
                  title="Recommendation Generation"
                  description="Strategic recommendations based on comprehensive analysis of all apps in the comparison."
                  steps={[
                    {
                      description:
                        "Identify common strengths across successful apps",
                    },
                    { description: "Analyze weaknesses and user pain points" },
                    {
                      description: "Evaluate feature sentiment and importance",
                    },
                    {
                      description:
                        "Prioritize actions based on potential impact",
                    },
                  ]}
                  dataSource="AI analysis of user reviews and app comparison"
                />
              }
              size="sm"
            />
          </CardTitle>
          <Badge className="rounded-full bg-amber-100 px-3 py-1 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Strategic Roadmap
          </Badge>
        </div>
        <CardDescription className="mt-1 text-sm text-gray-500 dark:text-amber-400/70">
          Follow these steps to create a better app than any competitor
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {comparisonResults.recommendationSummary.map((rec, i) => {
            // Extract step number if it exists
            const stepRegex = /^STEP (\d+):/;
            const stepMatch = stepRegex.exec(rec);
            const stepNumber = stepMatch ? stepMatch[1] : (i + 1).toString();
            const content = stepMatch ? rec.replace(/^STEP \d+: /, "") : rec;
            const title = content.split(".")[0] + ".";
            const description = content.split(".").slice(1).join(".");

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-amber-200 hover:bg-amber-50/10"
              >
                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-amber-600">
                    {stepNumber}
                  </div>
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-amber-50/50 px-6 py-4 dark:border-amber-900/50 dark:bg-amber-900/10">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm italic text-amber-700 dark:text-amber-400/90">
            Recommendations based on data from {comparisonResults.apps.length}{" "}
            analyzed apps
          </div>
          <Badge variant="outline" className="rounded-full text-xs">
            Priority Order
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
