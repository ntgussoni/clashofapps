interface StatusIndicatorProps {
  currentStatus: string | null;
  completed: boolean;
}

export default function StatusIndicator({
  currentStatus,
  completed,
}: StatusIndicatorProps) {
  if (!currentStatus) return null;

  if (completed) {
    return (
      <div className="mb-4 flex items-center rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
        {currentStatus}
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-center rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400"></div>
      {currentStatus}
    </div>
  );
}
