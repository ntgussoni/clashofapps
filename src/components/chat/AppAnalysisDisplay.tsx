import { useState } from "react";
import { AnalysisResultsData, ComparisonResultsData } from "../types";
import AnalysisCard from "./AnalysisCard";
import ComparisonSection from "./ComparisonSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle2,
  BarChart3,
  ArrowRightIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AppAnalysisDisplayProps {
  isLoading: boolean;
  error: string | null;
  analysisResults: AnalysisResultsData | null;
  comparisonResults: ComparisonResultsData | null;
  onNewAnalysis: () => void;
}

export default function AppAnalysisDisplay({
  isLoading,
  error,
  analysisResults,
  comparisonResults,
  onNewAnalysis,
}: AppAnalysisDisplayProps) {
  const [activeTab, setActiveTab] = useState<string>("analysis");

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-8 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={onNewAnalysis}
            className="mt-2"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!analysisResults && !comparisonResults) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Analysis Results</AlertTitle>
        <AlertDescription>
          Start a new analysis to see results here.
          <Button
            variant="outline"
            size="sm"
            onClick={onNewAnalysis}
            className="mt-2"
          >
            Start New Analysis
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Alert
        variant="success"
        className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
      >
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-300">
          Analysis Complete
        </AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400">
          Your app analysis has been completed successfully.
        </AlertDescription>
      </Alert>

      <Tabs
        defaultValue="analysis"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            App Analysis
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            disabled={!comparisonResults}
            className="flex items-center gap-1"
          >
            <ArrowRightIcon className="h-4 w-4" />
            Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-4">
          {analysisResults && <AnalysisCard result={analysisResults} />}
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          {comparisonResults && (
            <ComparisonSection comparisonResults={comparisonResults} />
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={onNewAnalysis} variant="outline">
          Start New Analysis
        </Button>
      </div>
    </div>
  );
}
