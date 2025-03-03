import { motion } from "framer-motion";

export default function SkeletonAppInfoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md min-w-[300px]"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/5 animate-pulse"></div>
        <div className="flex items-center bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded w-16 h-6 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">App ID:</span>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mt-1 animate-pulse"></div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Reviews:</span>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mt-1 animate-pulse"></div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Installs:</span>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mt-1 animate-pulse"></div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Version:</span>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mt-1 animate-pulse"></div>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 dark:text-gray-400">Categories:</span>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mt-1 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
}
