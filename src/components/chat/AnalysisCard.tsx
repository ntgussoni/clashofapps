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
    if (value > 0.5) return "success";
    if (value < 0) return "destructive";
    return "secondary";
  };

  // Helper function to get priority badge variant
  const getPriorityVariant = (
    priority: string,
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
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
      <Card className="w-full overflow-hidden border shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {result.appName}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="px-3 py-1">Analysis Results</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Based on user reviews and market data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="text-sm">
            Comprehensive analysis of user sentiment and market position
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-6">
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger
                value="strengths"
                className="flex items-center gap-1"
              >
                <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                Strengths
              </TabsTrigger>
              <TabsTrigger
                value="weaknesses"
                className="flex items-center gap-1"
              >
                <AlertCircleIcon className="h-4 w-4 text-red-500" />
                Weaknesses
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-yellow-500" />
                Features
              </TabsTrigger>
            </TabsList>

            {/* Strengths Tab */}
            <TabsContent value="strengths" className="space-y-3">
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <h3 className="mb-2 flex items-center gap-2 font-medium text-green-700 dark:text-green-400">
                  <ArrowUpIcon className="h-4 w-4" />
                  Key Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-start"
                    >
                      <span className="mr-2 mt-0.5 text-green-500">•</span>
                      <span className="text-sm text-green-800 dark:text-green-300">
                        {strength}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Weaknesses Tab */}
            <TabsContent value="weaknesses" className="space-y-3">
              <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                <h3 className="mb-2 flex items-center gap-2 font-medium text-red-700 dark:text-red-400">
                  <ArrowDownIcon className="h-4 w-4" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-start"
                    >
                      <span className="mr-2 mt-0.5 text-red-500">•</span>
                      <span className="text-sm text-red-800 dark:text-red-300">
                        {weakness}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-3">
              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <h3 className="mb-2 flex items-center gap-2 font-medium text-amber-700 dark:text-amber-400">
                  <StarIcon className="h-4 w-4" />
                  Top Features by Sentiment
                </h3>
                <div className="space-y-3">
                  {result.topFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="rounded-md bg-white p-2 shadow-sm dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {feature.feature}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getSentimentVariant(feature.sentiment)}
                          >
                            {formatSentiment(feature.sentiment)}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {feature.mentions} mentions
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={Math.max(
                            0,
                            (parseFloat(feature.sentiment) + 1) * 50,
                          )}
                          className="h-1.5"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Market Position & Demographics */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="overflow-hidden border shadow-sm">
              <CardHeader className="bg-blue-50 px-4 py-2 dark:bg-blue-900/20">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUpIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Market Position
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-3">
                <p className="text-sm">{result.marketPosition}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border shadow-sm">
              <CardHeader className="bg-purple-50 px-4 py-2 dark:bg-purple-900/20">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <UsersIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  User Demographics
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-3">
                <p className="text-sm">{result.userDemographics}</p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Perception */}
          <Card className="mt-4 overflow-hidden border shadow-sm">
            <CardHeader className="bg-emerald-50 px-4 py-2 dark:bg-emerald-900/20">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <DollarSignIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Pricing Perception
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Value for Money
                  </p>
                  <p
                    className={`mt-1 text-base font-semibold ${
                      parseFloat(result.pricing.valueForMoney) > 0.3
                        ? "text-green-600 dark:text-green-400"
                        : parseFloat(result.pricing.valueForMoney) < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {formatSentiment(result.pricing.valueForMoney)}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Complaints
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {result.pricing.pricingComplaints}%
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Willingness
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    {result.pricing.willingness}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="bg-gray-50 p-4 dark:bg-gray-800/50">
          <div className="w-full space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <LightbulbIcon className="h-4 w-4 text-amber-500" />
              Strategic Recommendations
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {result.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="rounded-lg border bg-white p-3 shadow-sm dark:bg-gray-800"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {rec.action}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={getPriorityVariant(rec.priority)}>
                      Priority: {rec.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      Impact: {rec.impact}
                    </Badge>
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
