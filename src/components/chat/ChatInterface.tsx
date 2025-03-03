import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SendIcon, BotIcon, UserIcon, RefreshCwIcon } from "lucide-react";
import AppAnalysisDisplay from "./AppAnalysisDisplay";
import { AnalysisResultsData, ComparisonResultsData } from "../types";
import WelcomeCard from "./WelcomeCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
  analysisResults: AnalysisResultsData | null;
  comparisonResults: ComparisonResultsData | null;
  error: string | null;
  onNewAnalysis: () => void;
}

export default function ChatInterface({
  onSendMessage,
  messages,
  isLoading,
  analysisResults,
  comparisonResults,
  error,
  onNewAnalysis,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Show results when analysis is complete
  useEffect(() => {
    if (analysisResults || comparisonResults) {
      setShowResults(true);
    }
  }, [analysisResults, comparisonResults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    await onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex h-full max-h-[calc(100vh-6rem)] flex-col">
      <Card className="flex h-full flex-col">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BotIcon className="h-5 w-5 text-primary" />
            App Analysis Assistant
          </CardTitle>
        </CardHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <WelcomeCard onNewAnalysis={onNewAnalysis} />
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar
                        className={
                          message.role === "assistant"
                            ? "bg-primary"
                            : "bg-secondary"
                        }
                      >
                        <AvatarFallback>
                          {message.role === "assistant" ? (
                            <BotIcon className="h-5 w-5" />
                          ) : (
                            <UserIcon className="h-5 w-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div
                          className={`mt-1 text-xs ${
                            message.role === "assistant"
                              ? "text-muted-foreground"
                              : "text-primary-foreground/80"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {showResults && (analysisResults ?? comparisonResults) && (
            <div className="border-t p-4">
              <AppAnalysisDisplay
                isLoading={isLoading}
                error={error}
                analysisResults={analysisResults}
                comparisonResults={comparisonResults}
                onNewAnalysis={onNewAnalysis}
              />
            </div>
          )}
        </div>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || inputValue.trim() === ""}
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={onNewAnalysis}
                  >
                    <RefreshCwIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New analysis</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
