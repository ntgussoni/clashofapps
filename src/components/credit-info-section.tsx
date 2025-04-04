"use client";

import { authClient } from "@/lib/auth-client";
import { CreditCard, Coins, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { api } from "@/trpc/react";

export function CreditInfoSection() {
  const { data: session } = authClient.useSession();
  const { data: credits, isLoading } = api.credits.getMyCredits.useQuery(
    undefined,
    {
      // Only fetch if logged in
      enabled: !!session?.user?.id,
      // Refresh every minute
      refetchInterval: 60 * 1000,
    },
  );

  if (!session) {
    return (
      <section className="container py-12 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Credits System
          </h2>
          <p className="mb-10 text-xl text-muted-foreground">
            Analyze apps with our powerful AI-driven system using credits
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-2 hover:border-orange-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <CreditCard className="mr-2 h-6 w-6 text-orange-500" />
                  Free Credits
                </CardTitle>
                <CardDescription>Start analyzing right away</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="mb-2 text-4xl font-bold">10</p>
                  <p className="text-muted-foreground">
                    Free credits for new users
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/login">Sign Up to Claim</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-orange-300 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Coins className="mr-2 h-6 w-6 text-orange-500" />
                  Credit Usage
                </CardTitle>
                <CardDescription>Simple and transparent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="mb-2 text-4xl font-bold">1:1</p>
                  <p className="text-muted-foreground">
                    1 credit = 1 app analysis
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-orange-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <ShieldCheck className="mr-2 h-6 w-6 text-orange-500" />
                  Premium Analysis
                </CardTitle>
                <CardDescription>Unlimited insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="mb-2 text-3xl font-bold">Detailed</p>
                  <p className="text-muted-foreground">
                    Comprehensive app insights
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Your Credits
          </h2>
          <p className="text-xl text-muted-foreground">
            You have{" "}
            <span className="font-bold text-orange-500">
              {isLoading ? "..." : (credits ?? 0)}
            </span>{" "}
            credits available
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-2 hover:border-orange-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Create New Analysis</CardTitle>
              <CardDescription>
                Compare apps and get detailed insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Each app analysis consumes 1 credit. A multi-app comparison
                consumes 1 credit per app.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild>
                <Link href="/new-analysis">Start New Analysis</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 hover:border-orange-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Need More Credits?</CardTitle>
              <CardDescription>Purchase additional credits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Buy additional credits to analyze more apps and get
                comprehensive insights.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild variant="outline">
                <Link href="/credits">Buy Credits</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
