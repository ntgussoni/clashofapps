"use client";

import React from "react";
import { HelpCircle, MessageSquare, Zap, type LucideProps } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface BrandIconProps extends LucideProps {
  className?: string;
  color?: string;
}

/**
 * A map of icon names to their corresponding components
 * Add new icons here as needed
 */
const ICON_MAP = {
  MessageSquare: MessageSquare,
  HelpCircle: HelpCircle,
  Zap: Zap,
  // Add more icons as needed
};

/**
 * A component that displays the configured brand icon
 * Uses a pre-defined map of icons to ensure type safety
 */
export function BrandIcon({ className, color, ...props }: BrandIconProps) {
  const iconName = siteConfig.logo.icon as keyof typeof ICON_MAP;
  const iconColor = color ?? siteConfig.logo.iconColor;

  // Use the configured icon or fall back to HelpCircle
  const Icon = ICON_MAP[iconName] ?? HelpCircle;

  return <Icon className={cn(iconColor, className)} {...props} />;
}
