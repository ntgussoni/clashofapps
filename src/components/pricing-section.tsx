import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="bg-muted/50 py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Choose Your Plan
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Simple, transparent pricing for businesses of all sizes.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {/* Starter Plan */}
          <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Starter</h3>
              <p className="text-sm text-muted-foreground">
                Perfect for indie developers and small teams.
              </p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              $29
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>100 chat queries per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Basic app comparison</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Sentiment analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Email support</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-xl border-2 border-primary bg-card p-6 shadow-md">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Most Popular
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Pro</h3>
              <p className="text-sm text-muted-foreground">
                For growing businesses and development teams.
              </p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              $79
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>500 chat queries per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Advanced app comparison</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Keyword analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Priority email support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Data export</span>
              </li>
            </ul>
            <Button className="mt-6" variant="default">
              Get Started
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Enterprise</h3>
              <p className="text-sm text-muted-foreground">
                For large organizations with advanced needs.
              </p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              $199
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Unlimited chat queries</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Full competitive analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>24/7 phone support</span>
              </li>
            </ul>
            <Button className="mt-6" variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
