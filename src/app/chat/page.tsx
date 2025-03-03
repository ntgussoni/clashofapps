"use client";

import { useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import { v4 as uuidv4 } from "uuid";
import { AnalysisResultsData, ComparisonResultsData } from "@/components/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: Date;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] =
    useState<AnalysisResultsData | null>(null);
  const [comparisonResults, setComparisonResults] =
    useState<ComparisonResultsData | null>(null);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: "user" as const,
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage = {
        id: uuidv4(),
        role: "assistant" as const,
        content: data.message || "I processed your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Set analysis results if available
      if (data.analysisResults) {
        setAnalysisResults(data.analysisResults);
      }

      // Set comparison results if available
      if (data.comparisonResults) {
        setComparisonResults(data.comparisonResults);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setMessages([]);
    setAnalysisResults(null);
    setComparisonResults(null);
    setError(null);
  };

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] max-w-6xl px-4 py-6">
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        error={error}
        analysisResults={analysisResults}
        comparisonResults={comparisonResults}
        onNewAnalysis={handleNewAnalysis}
      />
    </div>
  );
}
