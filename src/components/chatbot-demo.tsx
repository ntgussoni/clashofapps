"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { useChat } from "ai/react";
import { siteConfig } from "@/lib/config";
import { BrandIcon } from "@/components/ui/brand-icon";

export function ChatbotDemo() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <section className="bg-muted/50 py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-10 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Live Demo
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Try Our AI Chatbot
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Ask questions about apps, compare features, or analyze reviews.
              Watch as responses stream in real-time.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-2">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <BrandIcon className="h-5 w-5 text-primary" />
                {siteConfig.name} Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-2 text-center text-muted-foreground">
                    <Bot className="h-12 w-12 text-primary/20" />
                    <p>Ask me about app reviews, features, or comparisons!</p>
                    <div className="mx-auto grid max-w-md grid-cols-1 gap-2 md:grid-cols-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleInputChange({
                            target: {
                              value: "Compare SocialConnect and FitTracker Pro",
                            },
                          } as any)
                        }
                      >
                        Compare popular apps
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleInputChange({
                            target: {
                              value: "What do users like about DeliveryDash?",
                            },
                          } as any)
                        }
                      >
                        Analyze app reviews
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleInputChange({
                            target: {
                              value: "What are the top features of StreamFlix?",
                            },
                          } as any)
                        }
                      >
                        Top app features
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleInputChange({
                            target: {
                              value:
                                "How has SocialConnect's rating changed over time?",
                            },
                          } as any)
                        }
                      >
                        Rating trends
                      </Button>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex max-w-[80%] items-start gap-3">
                        {message.role !== "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-secondary">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary/40"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-3">
              <form
                onSubmit={handleSubmit}
                className="flex w-full items-center space-x-2"
              >
                <Input
                  placeholder="Ask about app reviews, features, or comparisons..."
                  value={input}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
