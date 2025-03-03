interface StatusIndicatorProps {
  currentStatus: string | null;
}

export default function StatusIndicator({
  currentStatus,
}: StatusIndicatorProps) {
  if (!currentStatus) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-300 text-sm flex items-center">
      <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"></div>
      {currentStatus}
    </div>
  );
}
