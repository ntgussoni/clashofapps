export default function SkeletonAnalysisCard() {
  return (
    <div className="w-full overflow-hidden rounded-md border shadow-sm">
      {/* Header */}
      <div className="border-b p-3">
        <div className="mb-2 h-5 w-3/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Tabs */}
        <div className="mb-3 flex overflow-hidden rounded-md border">
          <div className="h-7 flex-1 animate-pulse bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-7 flex-1 animate-pulse bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-7 flex-1 animate-pulse bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Tab Content */}
        <div className="mb-3 rounded-md border p-2">
          <div className="mb-2 h-3 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Position & Demographics */}
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-md border p-2">
            <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="rounded-md border p-2">
            <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Pricing Perception */}
        <div className="rounded-md border p-2">
          <div className="mb-2 h-3 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-md border p-1.5">
                <div className="mb-1 h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <div className="mb-2 h-3 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="grid gap-2 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-md border p-2">
              <div className="mb-1 h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-2 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
