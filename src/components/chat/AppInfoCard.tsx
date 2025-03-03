import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, DownloadIcon, TagIcon, InfoIcon } from "lucide-react";
import { App } from "@prisma/client";

interface AppInfoCardProps {
  appInfo: App;
}

export default function AppInfoCard({ appInfo }: AppInfoCardProps) {
  // Helper function to get color class based on rating
  const getRatingColorClass = (rating: number | string) => {
    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
    if (numRating >= 4.0) return "text-emerald-600 dark:text-emerald-400";
    if (numRating >= 3.0) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-w-[250px]" // Minimum width for readability
    >
      <Card className="h-full overflow-hidden border shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {appInfo.icon && (
                <div className="min-h-10 min-w-10 overflow-hidden rounded-md border shadow-sm">
                  <Image
                    src={appInfo.icon}
                    alt={`${appInfo.name} icon`}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                  />
                </div>
              )}
              <div>
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {appInfo.name}
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {appInfo.appId}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge className="flex items-center gap-1 px-2 py-0.5">
                <StarIcon className="h-3 w-3 text-amber-500" />
                <span
                  className={`text-sm font-medium ${getRatingColorClass(appInfo.score)}`}
                >
                  {typeof appInfo.score === "number"
                    ? appInfo.score.toFixed(1)
                    : Number(appInfo.score).toFixed(1)}
                </span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-md border bg-blue-50/30 p-3 shadow-sm dark:bg-blue-900/10">
              <div className="mb-1 flex items-center text-xs font-medium text-blue-700 dark:text-blue-400">
                <StarIcon className="mr-1 h-3.5 w-3.5" />
                <span>Reviews</span>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {appInfo.reviews}
              </p>
            </div>
            <div className="rounded-md border bg-purple-50/30 p-3 shadow-sm dark:bg-purple-900/10">
              <div className="mb-1 flex items-center text-xs font-medium text-purple-700 dark:text-purple-400">
                <DownloadIcon className="mr-1 h-3.5 w-3.5" />
                <span>Installs</span>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {appInfo.installs}
              </p>
            </div>
          </div>

          {/* Version */}
          <div className="mb-4 rounded-md border bg-gray-50/50 p-3 shadow-sm dark:bg-gray-800/20">
            <div className="mb-1 flex items-center text-xs font-medium text-gray-700 dark:text-gray-300">
              <InfoIcon className="mr-1 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              <span>Version</span>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {appInfo.version}
            </p>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-2 flex items-center text-xs font-medium text-gray-700 dark:text-gray-300">
              <TagIcon className="mr-1 h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                (appInfo.categories as { id: string; name: string }[]) ?? []
              ).map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="border-indigo-200 bg-indigo-50/50 px-2 py-0.5 text-xs text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
