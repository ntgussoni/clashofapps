import {
  BarChart3,
  MessageSquare,
  Zap,
  Search,
  GitCompare,
  Award,
  Star,
  UserCheck,
  Calendar,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              App Review Analysis Platform
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform analyzes Google Play Store and App Store app reviews, helping
              developers and product managers identify strengths, weaknesses,
              and opportunities for improvement.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Review Analysis</h3>
            <p className="text-muted-foreground">
              Analyze hundreds of app reviews instantly to extract key insights
              and user sentiment using advanced natural language processing.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Sentiment Analysis</h3>
            <p className="text-muted-foreground">
              Understand what users love and hate about your app with detailed
              sentiment breakdowns by feature and user segment.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <GitCompare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Competitor Analysis</h3>
            <p className="text-muted-foreground">
              Compare multiple apps side-by-side to identify competitive
              advantages, feature gaps, and market positioning.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Strengths & Weaknesses</h3>
            <p className="text-muted-foreground">
              Automatically identify your app&apos;s key strengths and
              weaknesses based on real user feedback and evidence.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Feature Performance</h3>
            <p className="text-muted-foreground">
              Track how specific features of your app are performing and which
              ones need improvement based on user reviews.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">User Segmentation</h3>
            <p className="text-muted-foreground">
              Identify different user segments and understand their specific
              needs, complaints, and feature requests.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Keyword Analysis</h3>
            <p className="text-muted-foreground">
              Discover the most important terms and topics mentioned in app
              reviews to identify trending issues and opportunities.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Pricing Analysis</h3>
            <p className="text-muted-foreground">
              Evaluate value for money perceptions and willingness to pay across
              different apps in your market segment.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Smart Recommendations</h3>
            <p className="text-muted-foreground">
              Get actionable recommendations based on comprehensive analysis of
              your app&apos;s performance and competitive positioning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
