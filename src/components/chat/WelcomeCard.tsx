import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RocketIcon,
  SearchIcon,
  BarChart3Icon,
  ArrowRightIcon,
} from "lucide-react";

interface WelcomeCardProps {
  onNewAnalysis: () => void;
}

export default function WelcomeCard({ onNewAnalysis }: WelcomeCardProps) {
  return (
    <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <RocketIcon className="h-5 w-5 text-primary" />
          Welcome to App Analysis
        </CardTitle>
        <CardDescription>
          Get insights about mobile apps based on user reviews
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg border bg-background p-4 text-center">
            <SearchIcon className="mb-2 h-8 w-8 text-primary" />
            <h3 className="font-medium">Search Apps</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Find and select apps to analyze from the Google Play Store
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border bg-background p-4 text-center">
            <BarChart3Icon className="mb-2 h-8 w-8 text-primary" />
            <h3 className="font-medium">Get Insights</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover strengths, weaknesses, and key features from user reviews
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border bg-background p-4 text-center">
            <ArrowRightIcon className="mb-2 h-8 w-8 text-primary" />
            <h3 className="font-medium">Compare Apps</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              See how apps stack up against each other in the same category
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm">
            <span className="font-medium">Example questions you can ask:</span>
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="text-muted-foreground">
              • &ldquo;Analyze Spotify and compare it with Apple Music&rdquo;
            </li>
            <li className="text-muted-foreground">
              • &ldquo;What are the strengths and weaknesses of
              Instagram?&rdquo;
            </li>
            <li className="text-muted-foreground">
              • &ldquo;Compare TikTok, Instagram, and Snapchat&rdquo;
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNewAnalysis} className="w-full">
          Start New Analysis
        </Button>
      </CardFooter>
    </Card>
  );
}
