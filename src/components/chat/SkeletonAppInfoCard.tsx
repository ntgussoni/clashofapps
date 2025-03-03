import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SkeletonAppInfoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-[250px]" // Minimum width for readability
    >
      <Card className="h-full overflow-hidden border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 animate-pulse rounded-md border bg-gray-200 dark:bg-gray-700"></div>
              <div>
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-0.5 h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="h-4 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          {/* Stats */}
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div className="rounded-md border p-2">
              <div className="mb-0.5 h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="rounded-md border p-2">
              <div className="mb-0.5 h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          {/* Version */}
          <div className="mb-3 rounded-md border p-2">
            <div className="mb-0.5 h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-1 h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-wrap gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
