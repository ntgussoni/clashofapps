import { motion } from "framer-motion";
import Image from "next/image";
import type { AppInfoData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, DownloadIcon, TagIcon, InfoIcon } from "lucide-react";

interface AppInfoCardProps {
  appInfo: AppInfoData;
}

export default function AppInfoCard({ appInfo }: AppInfoCardProps) {
  // Helper function to get color class based on rating
  const getRatingColorClass = (rating: number | string) => {
    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
    if (numRating >= 4.0) return "text-green-600 dark:text-green-400";
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
      <Card className="h-full overflow-hidden border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {appInfo.icon && (
                <div className="min-h-10 min-w-10 overflow-hidden rounded-md border">
                  <Image
                    src={appInfo.icon}
                    alt={`${appInfo.appName} icon`}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                  />
                </div>
              )}
              <div>
                <CardTitle className="text-lg font-medium">
                  {appInfo.appName}
                </CardTitle>
                <p className="mt-0.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                  {appInfo.appId}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <StarIcon className="mr-1 h-3 w-3 text-amber-500" />
              <span
                className={`text-sm font-medium ${getRatingColorClass(appInfo.rating)}`}
              >
                {typeof appInfo.rating === "number"
                  ? appInfo.rating.toFixed(1)
                  : Number(appInfo.rating).toFixed(1)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          {/* Stats */}
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div className="rounded-md border p-2">
              <div className="mb-0.5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <StarIcon className="mr-1 h-3 w-3" />
                <span>Reviews</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {appInfo.reviewCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border p-2">
              <div className="mb-0.5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <DownloadIcon className="mr-1 h-3 w-3" />
                <span>Installs</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {appInfo.installs}
              </p>
            </div>
          </div>

          {/* Version */}
          <div className="mb-3 rounded-md border p-2">
            <div className="mb-0.5 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <InfoIcon className="mr-1 h-3 w-3" />
              <span>Version</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {appInfo.version}
            </p>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <TagIcon className="mr-1 h-3 w-3" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {appInfo.categories.map((category, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-1.5 py-0 text-xs"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
