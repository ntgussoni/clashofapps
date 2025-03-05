import { Search, MessageSquare, BarChart3, Lightbulb } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple, Powerful App Analysis
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered chatbot makes it easy to extract valuable insights
              from app reviews and market data.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-10 py-12">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">1. Ask About Any App</h3>
                <p className="text-muted-foreground">
                  Simply type your question about any app or multiple apps. You
                  can ask about features, user sentiment, ratings, or
                  competitive analysis.
                </p>
              </div>
            </div>
            <div className="order-1 rounded-xl border bg-muted p-4 md:order-2">
              <div className="rounded-lg bg-card p-4 shadow-sm">
                <p className="mb-2 text-sm font-medium">Example Questions:</p>
                <ul className="space-y-2 text-sm">
                  <li className="rounded-md bg-primary/5 p-2">
                    &quot;Compare SocialConnect and StreamFlix&quot;
                  </li>
                  <li className="rounded-md bg-primary/5 p-2">
                    &quot;What do users dislike about DeliveryDash?&quot;
                  </li>
                  <li className="rounded-md bg-primary/5 p-2">
                    &quot;How has FitTracker Pro improved over time?&quot;
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="rounded-xl border bg-muted p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="rounded-lg bg-card p-3 shadow-sm">
                    <p className="text-sm">
                      Analyzing SocialConnect reviews...
                    </p>
                  </div>
                  <div className="rounded-lg bg-card p-3 shadow-sm">
                    <p className="text-sm">
                      Found 2.5M reviews with an average rating of 4.2/5
                    </p>
                  </div>
                  <div className="rounded-lg bg-card p-3 shadow-sm">
                    <p className="text-sm">Processing sentiment analysis...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                2. Watch Real-time Analysis
              </h3>
              <p className="text-muted-foreground">
                Our AI processes millions of reviews and app data in seconds,
                streaming the analysis to you in real-time so you can see the
                thinking process.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">
                  3. Get Actionable Insights
                </h3>
                <p className="text-muted-foreground">
                  Receive clear, actionable insights about what users love,
                  hate, and want from apps. Use these insights to improve your
                  own app or gain a competitive edge.
                </p>
              </div>
            </div>
            <div className="order-1 rounded-xl border bg-muted p-4 md:order-2">
              <div className="space-y-3 rounded-lg bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <p className="text-sm font-medium">Key Positive Insights:</p>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>
                    Users love the intuitive interface and quick response time
                  </li>
                  <li>
                    The story feature receives high praise for creative filters
                  </li>
                  <li>Direct messaging is considered reliable and secure</li>
                </ul>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <p className="text-sm font-medium">Areas for Improvement:</p>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Battery drain issues reported after latest update</li>
                  <li>Video upload stability needs improvement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
