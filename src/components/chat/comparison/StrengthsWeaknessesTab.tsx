import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { CalculationDetails } from "@/components/ui/CalculationDetails";
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import type { ComparisonResultsData } from "../../types";

interface StrengthsWeaknessesTabProps {
  comparisonResults: ComparisonResultsData;
}

export function StrengthsWeaknessesTab({
  comparisonResults,
}: StrengthsWeaknessesTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-emerald-50/30 p-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <CheckCircle2Icon className="h-4 w-4 text-gray-500" />
            Common Strengths
            <InfoTooltip
              content={
                <CalculationDetails
                  title="Common Strengths Analysis"
                  description="Strengths that appear across multiple apps based on sentiment analysis of user reviews."
                  steps={[
                    { description: "Extract positive sentiments from reviews" },
                    {
                      description:
                        "Group similar sentiments into strength categories",
                    },
                    {
                      description:
                        "Identify strengths mentioned across multiple apps",
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
          {comparisonResults.strengthsComparison.common.length > 0 ? (
            <ul className="space-y-3">
              {comparisonResults.strengthsComparison.common.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircle2Icon className="mr-2 mt-0.5 h-4 w-4 text-emerald-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.strength}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.apps.map((app, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm italic text-gray-500 dark:text-gray-400">
              No common strengths found
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-rose-50/30 p-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <AlertCircleIcon className="h-4 w-4 text-gray-500" />
            Common Weaknesses
            <InfoTooltip
              content={
                <CalculationDetails
                  title="Common Weaknesses Analysis"
                  description="Weaknesses that appear across multiple apps based on sentiment analysis of user reviews."
                  steps={[
                    { description: "Extract negative sentiments from reviews" },
                    {
                      description:
                        "Group similar sentiments into weakness categories",
                    },
                    {
                      description:
                        "Identify weaknesses mentioned across multiple apps",
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
          {comparisonResults.weaknessesComparison.common.length > 0 ? (
            <ul className="space-y-3">
              {comparisonResults.weaknessesComparison.common.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-start"
                >
                  <AlertCircleIcon className="mr-2 mt-0.5 h-4 w-4 text-red-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.weakness}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.apps.map((app, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm italic text-gray-500 dark:text-gray-400">
              No common weaknesses found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
