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
            <CardHeader className="bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                <LightbulbIcon className="h-4 w-4" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {comparisonResults.recommendationSummary.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-start rounded-md bg-gray-50 p-3 dark:bg-gray-800"
                  >
                    <span className="mr-2 mt-0.5 text-amber-500">•</span>
                    <span className="text-sm">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </motion.div>
  );
}
