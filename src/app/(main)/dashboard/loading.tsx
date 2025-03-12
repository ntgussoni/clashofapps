import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Comparisons</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all your app comparisons
          </p>
        </div>
        <Link href="/new-analysis">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Comparison
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {/* First App Skeleton */}
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <Skeleton className="mt-2 h-4 w-[70px]" />
                </div>

                {/* VS Skeleton */}
                <div className="flex flex-col items-center">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="mt-1 h-3 w-5" />
                </div>

                {/* Second App Skeleton */}
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <Skeleton className="mt-2 h-4 w-[70px]" />
                </div>
              </div>

              {/* Additional apps skeleton */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 p-2 text-xs text-muted-foreground">
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
