import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2Icon,
  XCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  ArrowRightIcon,
  BarChart3Icon,
  CodeIcon,
} from "lucide-react";

interface CalculationDetailsProps {
  title: string;
  description: string;
  formula?: string;
  steps?: {
    description: string;
    value?: string | number;
  }[];
  example?: {
    inputs: Record<string, string | number | boolean>;
    result: string | number | boolean;
  };
  dataSource?: string;
  sampleSize?: number;
  className?: string;
  onViewReviews?: () => void;
}

export function CalculationDetails({
  title,
  description,
  formula,
  steps,
  example,
  dataSource,
  sampleSize,
  className,
  onViewReviews,
}: CalculationDetailsProps) {
  return (
    <div className={cn("space-y-3 text-sm", className)}>
      <div className="flex flex-col space-y-1.5">
        <h4 className="text-base font-medium">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {formula && (
        <div className="rounded bg-secondary/20 p-2 font-mono text-xs">
          <div className="mb-1 flex items-center gap-1 text-muted-foreground">
            <CodeIcon className="h-3 w-3" />
            <span>Formula:</span>
          </div>
          <code className="break-all">{formula}</code>
        </div>
      )}

      {steps && steps.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3Icon className="h-3 w-3" />
            <span>Calculation Steps:</span>
          </div>
          <ul className="space-y-1.5 border-l pl-2">
            {steps.map((step, i) => (
              <li key={i} className="relative flex items-start gap-2">
                <span className="absolute -left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <div className="text-xs leading-5">
                  <span className="text-foreground">{step.description}</span>
                  {step.value !== undefined && (
                    <Badge
                      variant="outline"
                      className="ml-1.5 py-0 font-mono text-[10px]"
                    >
                      {String(step.value)}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {example && (
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">Example:</div>
          <div className="rounded border p-2 text-xs">
            <div className="space-y-1">
              <div className="font-medium">Inputs:</div>
              <ul className="space-y-0.5 pl-4">
                {Object.entries(example.inputs).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-mono">{key}:</span> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <ArrowRightIcon className="h-3 w-3" />
              <span className="font-medium">Result:</span>{" "}
              <span className="font-mono">{String(example.result)}</span>
            </div>
          </div>
        </div>
      )}

      {(dataSource ?? sampleSize) && (
        <div className="border-t pt-1 text-xs text-muted-foreground">
          {dataSource && <div>Data source: {dataSource}</div>}
          {sampleSize && <div>Sample size: {sampleSize} reviews</div>}
        </div>
      )}

      {onViewReviews && (
        <div className="pt-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-full text-xs"
            onClick={onViewReviews}
          >
            View Source Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
