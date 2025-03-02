import { BarChart3, MessageSquare, Zap, TrendingUp, Search, LineChart } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Analyze Apps</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered chatbot provides deep insights into app reviews and performance metrics, helping you make
              data-driven decisions.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <div className="grid gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">AI-Powered Chat</h3>
            <p className="text-muted-foreground">
              Ask questions in natural language and get instant insights about any app on the market.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Real-time Streaming</h3>
            <p className="text-muted-foreground">
              Watch as analysis happens in real-time with our streaming response technology.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Sentiment Analysis</h3>
            <p className="text-muted-foreground">
              Understand what users love, hate, and want from apps with our advanced sentiment analysis.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Keyword Insights</h3>
            <p className="text-muted-foreground">
              Discover the most important terms and topics mentioned in app reviews.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Competitive Analysis</h3>
            <p className="text-muted-foreground">
              Compare multiple apps side-by-side to identify competitive advantages and weaknesses.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Trend Tracking</h3>
            <p className="text-muted-foreground">
              Monitor how app ratings and sentiment change over time to spot emerging trends.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

