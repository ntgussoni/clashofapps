import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export function InfoTooltip({
  content,
  children,
  className = "",
  side = "top",
  align = "center",
  size = "md",
  interactive = false,
}: InfoTooltipProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger
          asChild
          className={`inline-flex cursor-help opacity-70 hover:opacity-100 ${className}`}
          aria-label="More information"
        >
          {children ?? (
            <HelpCircle
              className={`${sizeClasses[size]} text-muted-foreground`}
              strokeWidth={1.5}
            />
          )}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={`max-w-[320px] p-3 ${interactive ? "cursor-auto" : ""}`}
          sideOffset={8}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
