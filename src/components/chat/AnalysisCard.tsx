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
  BarChart3Icon,
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

  // Helper function to get progress bar color
  const getProgressColor = (sentiment: string): string => {
    const value = parseFloat(sentiment);
    if (value > 0.5) return "bg-emerald-500";
    if (value < 0) return "bg-red-500";
    return "bg-amber-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full min-w-[500px] overflow-hidden border shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              <BarChart3Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {result.appName}
            </CardTitle>
            <Badge className="px-2 py-0.5">Analysis</Badge>
          </div>
          <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
            Based on user reviews and market data
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger
                value="strengths"
                className="flex items-center gap-1 text-sm"
              >
                <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-500" />
                Strengths
              </TabsTrigger>
              <TabsTrigger
                value="weaknesses"
                className="flex items-center gap-1 text-sm"
              >
                <AlertCircleIcon className="h-3.5 w-3.5 text-red-500" />
                Weaknesses
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex items-center gap-1 text-sm"
              >
                <StarIcon className="h-3.5 w-3.5 text-amber-500" />
                Features
              </TabsTrigger>
            </TabsList>

            {/* Strengths Tab */}
            <TabsContent value="strengths" className="space-y-3">
              <div className="rounded-md border bg-emerald-50/30 p-3 shadow-sm dark:bg-emerald-900/10">
                <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                  Key Strengths
                </h3>
                <ul className="space-y-1.5">
                  {result.strengths.map((strength, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="flex items-start"
                    >
                      <span className="mr-1.5 mt-0.5 text-emerald-400">•</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {strength}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Weaknesses Tab */}
            <TabsContent value="weaknesses" className="space-y-3">
              <div className="rounded-md border bg-red-50/30 p-3 shadow-sm dark:bg-red-900/10">
                <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-red-700 dark:text-red-400">
                  <ArrowDownIcon className="h-3.5 w-3.5" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-1.5">
                  {result.weaknesses.map((weakness, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="flex items-start"
                    >
                      <span className="mr-1.5 mt-0.5 text-red-400">•</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {weakness}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-3">
              <div className="rounded-md border bg-amber-50/30 p-3 shadow-sm dark:bg-amber-900/10">
                <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400">
                  <StarIcon className="h-3.5 w-3.5" />
                  Top Features
                </h3>
                <div className="space-y-3">
                  {result.topFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {feature.feature}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="px-1.5 py-0.5 text-xs"
                          >
                            {formatSentiment(feature.sentiment)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0.5 text-xs"
                          >
                            {feature.mentions}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-1.5">
                        <Progress
                          value={Math.max(
                            0,
                            (parseFloat(feature.sentiment) + 1) * 50,
                          )}
                          className={`h-1.5 ${getProgressColor(feature.sentiment)}`}
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
            <div className="rounded-md border bg-blue-50/30 p-3 shadow-sm dark:bg-blue-900/10">
              <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-blue-700 dark:text-blue-400">
                <TrendingUpIcon className="h-3.5 w-3.5" />
                Market Position
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {result.marketPosition}
              </p>
            </div>

            <div className="rounded-md border bg-purple-50/30 p-3 shadow-sm dark:bg-purple-900/10">
              <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-purple-700 dark:text-purple-400">
                <UsersIcon className="h-3.5 w-3.5" />
                User Demographics
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {result.userDemographics}
              </p>
            </div>
          </div>

          {/* Pricing Perception */}
          <div className="mt-4 rounded-md border bg-indigo-50/30 p-3 shadow-sm dark:bg-indigo-900/10">
            <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-indigo-700 dark:text-indigo-400">
              <DollarSignIcon className="h-3.5 w-3.5" />
              Pricing Perception
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md border bg-white p-2 shadow-sm dark:bg-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Value
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {formatSentiment(result.pricing.valueForMoney)}
                </p>
              </div>
              <div className="rounded-md border bg-white p-2 shadow-sm dark:bg-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Complaints
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {result.pricing.pricingComplaints}%
                </p>
              </div>
              <div className="rounded-md border bg-white p-2 shadow-sm dark:bg-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Perception
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
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
