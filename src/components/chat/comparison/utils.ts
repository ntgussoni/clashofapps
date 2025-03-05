/**
 * Converts a decimal to percentage string
 * @param value - Decimal value (0-1)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const toPercentage = (value: number, decimals = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Gets the appropriate badge variant based on sentiment value
 * @param sentiment - Sentiment score (-1 to 1)
 * @returns Badge variant
 */
export const getSentimentVariant = (
  sentiment: number,
): "default" | "destructive" | "outline" | "secondary" | "success" => {
  if (sentiment > 0.5) return "success";
  if (sentiment < 0) return "destructive";
  return "secondary";
};

/**
 * Gets the appropriate CSS class for rating color
 * @param rating - Rating value (0-5)
 * @returns CSS class for text color
 */
export const getRatingColorClass = (rating: number): string => {
  if (rating >= 4.0) return "text-emerald-600 dark:text-emerald-400";
  if (rating >= 3.0) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

/**
 * Gets the appropriate CSS class for progress bar based on sentiment
 * @param sentiment - Sentiment score (-1 to 1)
 * @returns CSS class for progress bar
 */
export const getSentimentProgressClass = (sentiment: number): string => {
  if (sentiment > 0.5) return "bg-emerald-500";
  if (sentiment < 0) return "bg-red-500";
  return "bg-amber-500";
};

/**
 * Converts sentiment score (-1 to 1) to progress value (0-100)
 * @param sentiment - Sentiment score (-1 to 1)
 * @returns Progress value (0-100)
 */
export const sentimentToProgressValue = (sentiment: number): number => {
  return (sentiment + 1) * 50; // Convert -1...1 to 0...100
};

/**
 * Formats a number with thousands separators
 * @param value - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Extracts step number from recommendation text
 * @param text - Recommendation text
 * @param index - Index in the array
 * @returns Step number as string
 */
export const extractStepNumber = (text: string, index: number): string => {
  const stepRegex = /^STEP (\d+):/;
  const stepMatch = stepRegex.exec(text);
  return stepMatch?.[1] ?? (index + 1).toString();
};

/**
 * Cleans recommendation text by removing step prefix
 * @param text - Recommendation text
 * @returns Cleaned text
 */
export const cleanRecommendationText = (text: string): string => {
  return text.replace(/^STEP \d+: /, "");
};
