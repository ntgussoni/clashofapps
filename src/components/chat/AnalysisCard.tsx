import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  StarIcon,
  UsersIcon,
  TrendingUpIcon,
  DollarSignIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  LightbulbIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AnalysisResultsData } from "../types";
import { motion } from "framer-motion";

interface AnalysisCardProps {
  result: AnalysisResultsData;
}

export default function AnalysisCard({ result }: AnalysisCardProps) {
  // Helper function to get color based on sentiment value
  const getSentimentVariant = (
    sentiment: string,
  ): "default" | "destructive" | "outline" | "secondary" | "success" => {
    const value = parseFloat(sentiment);
    if (value > 0.5) return "outline";
    if (value < 0) return "outline";
    return "outline";
  };

  // Helper function to get priority badge variant
  const getPriorityVariant = (
    priority: string,
  ): "default" | "destructive" | "outline" | "secondary" => {
    return "outline";
  };

  // Format sentiment value for display
  const formatSentiment = (sentiment: string): string => {
    const value = parseFloat(sentiment);
    return value.toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full min-w-[500px] overflow-hidden border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              {result.appName}
            </CardTitle>
            <Badge variant="outline" className="px-2 py-0.5 text-xs">
              Analysis
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Based on user reviews and market data
          </CardDescription>
        </CardHeader>

        <CardContent className="p-3 pt-4">
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="mb-3 grid w-full grid-cols-3">
              <TabsTrigger
                value="strengths"
                className="flex items-center gap-1 text-xs"
              >
                <CheckCircle2Icon className="h-3 w-3" />
                Strengths
              </TabsTrigger>
              <TabsTrigger
                value="weaknesses"
                className="flex items-center gap-1 text-xs"
              >
                <AlertCircleIcon className="h-3 w-3" />
                Weaknesses
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex items-center gap-1 text-xs"
              >
                <StarIcon className="h-3 w-3" />
                Features
              </TabsTrigger>
            </TabsList>

            {/* Strengths Tab */}
            <TabsContent value="strengths" className="space-y-2">
              <div className="rounded-md border p-2">
                <h3 className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <ArrowUpIcon className="h-3 w-3" />
                  Key Strengths
                </h3>
                <ul className="space-y-1">
                  {result.strengths.map((strength, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="flex items-start"
                    >
                      <span className="mr-1 mt-0.5 text-gray-400">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {strength}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Weaknesses Tab */}
            <TabsContent value="weaknesses" className="space-y-2">
              <div className="rounded-md border p-2">
                <h3 className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <ArrowDownIcon className="h-3 w-3" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-1">
                  {result.weaknesses.map((weakness, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="flex items-start"
                    >
                      <span className="mr-1 mt-0.5 text-gray-400">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {weakness}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-2">
              <div className="rounded-md border p-2">
                <h3 className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <StarIcon className="h-3 w-3" />
                  Top Features
                </h3>
                <div className="space-y-2">
                  {result.topFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="border-b border-gray-100 pb-1 last:border-0 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {feature.feature}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatSentiment(feature.sentiment)}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {feature.mentions}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <Progress
                          value={Math.max(
                            0,
                            (parseFloat(feature.sentiment) + 1) * 50,
                          )}
                          className="h-1"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Market Position & Demographics */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-md border p-2">
              <h3 className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                <TrendingUpIcon className="h-3 w-3" />
                Market Position
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {result.marketPosition}
              </p>
            </div>

            <div className="rounded-md border p-2">
              <h3 className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                <UsersIcon className="h-3 w-3" />
                User Demographics
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {result.userDemographics}
              </p>
            </div>
          </div>

          {/* Pricing Perception */}
          <div className="mt-3 rounded-md border p-2">
            <h3 className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              <DollarSignIcon className="h-3 w-3" />
              Pricing Perception
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md border p-1.5">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Value
                </p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {formatSentiment(result.pricing.valueForMoney)}
                </p>
              </div>
              <div className="rounded-md border p-1.5">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Complaints
                </p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {result.pricing.pricingComplaints}%
                </p>
              </div>
              <div className="rounded-md border p-1.5">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Willingness
                </p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {result.pricing.willingness}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t p-3">
          <div className="w-full space-y-2">
            <h4 className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              <LightbulbIcon className="h-3 w-3" />
              Recommendations
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {result.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="rounded-md border p-2"
                >
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {rec.action}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {rec.priority} priority • {rec.impact} impact
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
