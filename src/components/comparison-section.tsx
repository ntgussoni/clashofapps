"use client";
import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat-interface";

interface ComparisonSectionProps {
  appLinks: string[];
}

export function ComparisonSection({ appLinks }: ComparisonSectionProps) {
  // Extract app IDs from links for the initial message
  const appIds = appLinks.map((link) => {
    const match = link.match(/id=([^&]+)/);
    return match ? match[1] : link;
  });

  return (
    <div className="container px-4 py-8 md:px-6">
      {/* Status indicator */}
      <StatusIndicator currentStatus={currentStatus} />
    </div>
  );
}
