import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  StarIcon,
  DollarSignIcon,
  BarChart3Icon,
  LightbulbIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  TrendingUpIcon,
} from "lucide-react";
import type { ComparisonResultsData } from "../types";

interface ComparisonSectionProps {
  comparisonResults: ComparisonResultsData;
}

export default function ComparisonSection({
  comparisonResults,
}: ComparisonSectionProps) {
  // Helper function to get badge variant based on sentiment value
  const getSentimentVariant = (
    sentiment: number,
  ): "default" | "destructive" | "outline" | "secondary" | "success" => {
    if (sentiment > 0.5) return "success";
    if (sentiment < 0) return "destructive";
    return "secondary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6 w-full"
    >
      <Card className="overflow-hidden border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <BarChart3Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Cross-App Comparison
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="px-3 py-1">Comparative Analysis</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Based on aggregated user reviews across multiple apps</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="text-sm">
            Comprehensive comparison of key metrics across competing apps
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-6">
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-4">
              <TabsTrigger value="metrics" className="flex items-center gap-1">
                <BarChart3Icon className="h-4 w-4 text-blue-500" />
                Key Metrics
              </TabsTrigger>
              <TabsTrigger
                value="strengths-weaknesses"
                className="flex items-center gap-1"
              >
                <TrendingUpIcon className="h-4 w-4 text-purple-500" />
                Strengths & Weaknesses
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-amber-500" />
                Features
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-1">
                <DollarSignIcon className="h-4 w-4 text-emerald-500" />
                Pricing
              </TabsTrigger>
            </TabsList>

            {/* Key Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h3 className="mb-3 flex items-center gap-2 font-medium text-blue-700 dark:text-blue-400">
                  <BarChart3Icon className="h-4 w-4" />
                  App Performance Overview
                </h3>
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
                      <TableRow>
                        <TableHead className="font-medium">App</TableHead>
                        <TableHead className="font-medium">Rating</TableHead>
                        <TableHead className="font-medium">Reviews</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonResults.apps.map((app, i) => (
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
                              <StarIcon className="mr-1 h-4 w-4 text-yellow-500" />
                              <span className="font-medium">
                                {typeof app.rating === "number"
                                  ? app.rating.toFixed(1)
                                  : Number(app.rating).toFixed(1)}
                              </span>
                            </div>
                            <div className="mt-1 w-full">
                              <Progress
                                value={app.rating * 20}
                                className="h-1.5"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {app.ratingCount.toLocaleString()}
                            </span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Strengths & Weaknesses Tab */}
            <TabsContent value="strengths-weaknesses" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="overflow-hidden border shadow-sm">
                  <CardHeader className="bg-green-50 px-4 py-3 dark:bg-green-900/20">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                      <CheckCircle2Icon className="h-4 w-4" />
                      Common Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {comparisonResults.strengthsComparison.common.length > 0 ? (
                      <ul className="space-y-2">
                        {comparisonResults.strengthsComparison.common.map(
                          (item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className="rounded-md bg-green-50 p-3 dark:bg-green-900/20"
                            >
                              <span className="font-medium text-green-800 dark:text-green-300">
                                {item.strength}
                              </span>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.apps.map((app, j) => (
                                  <Badge
                                    key={j}
                                    variant="outline"
                                    className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
                                  >
                                    {app}
                                  </Badge>
                                ))}
                              </div>
                            </motion.li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p className="text-center text-sm italic text-gray-500 dark:text-gray-400">
                        No common strengths found
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border shadow-sm">
                  <CardHeader className="bg-red-50 px-4 py-3 dark:bg-red-900/20">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
                      <AlertCircleIcon className="h-4 w-4" />
                      Common Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {comparisonResults.weaknessesComparison.common.length >
                    0 ? (
                      <ul className="space-y-2">
                        {comparisonResults.weaknessesComparison.common.map(
                          (item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className="rounded-md bg-red-50 p-3 dark:bg-red-900/20"
                            >
                              <span className="font-medium text-red-800 dark:text-red-300">
                                {item.weakness}
                              </span>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.apps.map((app, j) => (
                                  <Badge
                                    key={j}
                                    variant="outline"
                                    className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
                                  >
                                    {app}
                                  </Badge>
                                ))}
                              </div>
                            </motion.li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p className="text-center text-sm italic text-gray-500 dark:text-gray-400">
                        No common weaknesses found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                <h3 className="mb-3 flex items-center gap-2 font-medium text-amber-700 dark:text-amber-400">
                  <StarIcon className="h-4 w-4" />
                  Feature Comparison
                </h3>
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
                      <TableRow>
                        <TableHead className="font-medium">Feature</TableHead>
                        <TableHead className="font-medium">
                          App Coverage
                        </TableHead>
                        <TableHead className="font-medium">Sentiment</TableHead>
                        <TableHead className="font-medium">Mentions</TableHead>
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
                              <span className="font-medium">
                                {(feature.appCoverage * 100).toFixed(0)}%
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
                            <Badge
                              variant={getSentimentVariant(
                                feature.averageSentiment,
                              )}
                            >
                              {feature.averageSentiment.toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {feature.totalMentions}
                            </span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <h3 className="mb-3 flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
                  <DollarSignIcon className="h-4 w-4" />
                  Pricing Perception
                </h3>
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
                      <TableRow>
                        <TableHead className="font-medium">App</TableHead>
                        <TableHead className="font-medium">
                          Value for Money
                        </TableHead>
                        <TableHead className="font-medium">
                          Complaints
                        </TableHead>
                        <TableHead className="font-medium">
                          Willingness
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
                            <Badge
                              variant={getSentimentVariant(
                                pricing.valueForMoney,
                              )}
                            >
                              {pricing.valueForMoney.toFixed(2)}
                            </Badge>
                            <div className="mt-1 w-full">
                              <Progress
                                value={Math.max(
                                  0,
                                  (pricing.valueForMoney + 1) * 50,
                                )}
                                className="h-1.5"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {pricing.pricingComplaints}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
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
            </TabsContent>
          </Tabs>

          {/* Recommendations Summary */}
          <Card className="mt-6 overflow-hidden border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-4 dark:from-amber-950/30 dark:to-orange-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-amber-700 dark:text-amber-400">
                  <LightbulbIcon className="h-5 w-5" />
                  Action Plan for Success
                </CardTitle>
                <Badge className="bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  Strategic Roadmap
                </Badge>
              </div>
              <CardDescription className="mt-1 text-sm text-amber-700/70 dark:text-amber-400/70">
                Follow these steps to create a better app than any competitor
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute bottom-0 left-[19px] top-0 w-0.5 bg-gradient-to-b from-amber-400 to-orange-400 dark:from-amber-600 dark:to-orange-600"></div>

                <ul className="relative space-y-4">
                  {comparisonResults.recommendationSummary.map((rec, i) => {
                    // Extract step number if it exists
                    const stepRegex = /^STEP (\d+):/;
                    const stepMatch = stepRegex.exec(rec);
                    const stepNumber = stepMatch
                      ? stepMatch[1]
                      : (i + 1).toString();
                    const content = stepMatch
                      ? rec.replace(/^STEP \d+: /, "")
                      : rec;

                    return (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="relative flex items-start pl-10"
                      >
                        {/* Step number circle */}
                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-400 font-bold text-white shadow-md dark:from-amber-600 dark:to-orange-600">
                          {stepNumber}
                        </div>

                        {/* Content */}
                        <div className="flex-1 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-800 dark:bg-amber-900/20">
                          <div className="mb-1 font-medium text-amber-900 dark:text-amber-300">
                            {content.split(".")[0]}.
                          </div>
                          <div className="text-sm text-amber-700 dark:text-amber-400/80">
                            {content.split(".").slice(1).join(".")}
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-amber-50/50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-900/10">
              <div className="flex w-full items-center justify-between">
                <div className="text-sm italic text-amber-700 dark:text-amber-400/90">
                  Recommendations based on data from{" "}
                  {comparisonResults.apps.length} analyzed apps
                </div>
                <Badge variant="outline" className="text-xs">
                  Priority Order
                </Badge>
              </div>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </motion.div>
  );
}
