export default function SkeletonAnalysisCard() {
  return (
    <div className="space-y-4 min-w-[350px]">
      <div className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg">
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/5 animate-pulse"></div>
      </div>

      {/* Strengths */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <span className="mr-2 text-green-500">↑</span>
          Strengths
        </h4>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <span className="mr-2 text-red-500">↓</span>
          Weaknesses
        </h4>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Features */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
          Top Features
        </h4>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Position & Demographics */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
          Market Position & Demographics
        </h4>
        <div className="text-sm space-y-2">
          <div>
            <span className="text-gray-500 dark:text-gray-400 block">
              Market Position:
            </span>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-1 animate-pulse"></div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 block">
              User Demographics:
            </span>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-1 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Pricing Perception */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
          Pricing Perception
        </h4>
        <div className="space-y-2 text-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
          Recommendations
        </h4>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-sm"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
              <div className="flex mt-1 text-xs space-x-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
