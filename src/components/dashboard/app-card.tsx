import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftRight, AppWindow } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AppData {
  id?: number;
  appStoreId?: string;
  name?: string;
  icon?: string | null;
}

interface Analysis {
  id: number;
  slug: string;
  apps: AppData[];
  createdAt: Date;
}

interface AppCardProps {
  analysis: Analysis;
}

export function AppCard({ analysis }: AppCardProps) {
  return (
    <Link
      href={`/analysis/${analysis.slug}`}
      className="block transition-all duration-200 hover:scale-[1.02]"
    >
      <Card className="h-full overflow-hidden border-gray-200 bg-white/80 backdrop-blur-sm hover:border-gray-300 hover:shadow-lg">
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {analysis.apps.length} Apps
            </Badge>
            <CardDescription className="text-xs font-medium text-gray-500">
              {formatDistanceToNow(new Date(analysis.createdAt), {
                addSuffix: true,
              })}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-6">
          {/* Display apps with comparison indicator */}
          <div className="flex items-center justify-center">
            <AppComparisonDisplay apps={analysis.apps} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface AppComparisonDisplayProps {
  apps: AppData[];
}

function AppComparisonDisplay({ apps }: AppComparisonDisplayProps) {
  if (apps.length === 0) {
    return <div className="text-sm text-gray-500">No apps to display</div>;
  }

  // For 2 apps, show a direct comparison
  if (apps.length === 2) {
    return (
      <div className="flex items-center justify-center gap-2">
        <AppIcon app={apps[0]!} index={0} />
        <ComparisonIndicator />
        <AppIcon app={apps[1]!} index={1} />
      </div>
    );
  }

  // For more than 2 apps, show them in a grid with comparison icon in the center
  return (
    <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3">
      {apps.map((app, index) => (
        <AppIcon key={index} app={app} index={index} />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 shadow-md">
          <ArrowLeftRight className="h-4 w-4 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

function ComparisonIndicator() {
  return (
    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-100 shadow-sm">
      <ArrowLeftRight className="h-5 w-5 text-blue-600" />
    </div>
  );
}

interface AppIconProps {
  app: AppData;
  index: number;
}

function AppIcon({ app, index }: AppIconProps) {
  const hasIcon = typeof app?.icon === "string" && app.icon;

  return (
    <div className="group flex flex-col items-center text-center">
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-all duration-200 group-hover:border-blue-200 group-hover:shadow-md">
        {hasIcon ? (
          <Image
            src={app.icon as string}
            alt={`${app?.name ?? `App ${index + 1}`} icon`}
            width={64}
            height={64}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <AppWindow className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <span className="mt-2 block max-w-full truncate text-xs font-medium text-gray-700 group-hover:text-gray-900">
        {app?.name ?? `App ${index + 1}`}
      </span>
    </div>
  );
}
