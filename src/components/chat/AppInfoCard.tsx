import { motion } from "framer-motion";
import Image from "next/image";
import type { AppInfoData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, DownloadIcon, TagIcon, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppInfoCardProps {
  appInfo: AppInfoData;
}

export default function AppInfoCard({ appInfo }: AppInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border shadow-md">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 pb-4 dark:from-slate-950/30 dark:to-blue-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {appInfo.icon && (
                <div className="h-12 w-12 overflow-hidden rounded-lg border shadow-sm">
                  <Image
                    src={appInfo.icon}
                    alt={`${appInfo.appName} icon`}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                </div>
              )}
              <div>
                <CardTitle className="text-xl font-bold">
                  {appInfo.appName}
                </CardTitle>
                <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
                  {appInfo.appId}
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center rounded-full bg-amber-100 px-3 py-1 dark:bg-amber-900/30">
                    <StarIcon className="mr-1 h-4 w-4 text-amber-500" />
                    <span className="font-medium text-amber-700 dark:text-amber-400">
                      {typeof appInfo.rating === "number"
                        ? appInfo.rating.toFixed(1)
                        : Number(appInfo.rating).toFixed(1)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>App rating based on user reviews</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="mb-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <StarIcon className="mr-1 h-4 w-4" />
                <span>Reviews</span>
              </div>
              <p className="text-lg font-semibold">
                {appInfo.reviewCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="mb-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <DownloadIcon className="mr-1 h-4 w-4" />
                <span>Installs</span>
              </div>
              <p className="text-lg font-semibold">{appInfo.installs}</p>
            </div>
          </div>

          {/* Version */}
          <div className="mb-6 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="mb-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <InfoIcon className="mr-1 h-4 w-4" />
              <span>Version</span>
            </div>
            <p className="font-medium">{appInfo.version}</p>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <TagIcon className="mr-1 h-4 w-4" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {appInfo.categories.map((category, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
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
