import { motion } from "framer-motion";

export default function SkeletonComparisonSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        Cross-App Comparison
      </h3>

      {/* Key Metrics Comparison */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Metrics
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  App
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  Rating
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  Reviews
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <span className="mr-2 text-green-500">↑</span>
            Common Strengths
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i}>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mt-1 animate-pulse"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <span className="mr-2 text-red-500">↓</span>
            Common Weaknesses
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i}>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mt-1 animate-pulse"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Feature Comparison
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  Feature
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  App Coverage
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  Avg. Sentiment
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  Total Mentions
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-App Recommendations */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Cross-App Recommendations
        </h4>
        <ul className="space-y-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-start">
              <span className="text-blue-500 mr-2">→</span>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
