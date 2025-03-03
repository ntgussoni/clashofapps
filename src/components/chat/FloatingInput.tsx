import { FormEvent } from "react";

interface FloatingInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isHero?: boolean; // Optional prop to indicate if this is in hero mode
}

export default function FloatingInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isHero = false, // Default to floating mode
}: FloatingInputProps) {
  // If in hero mode, show a non-fixed input
  if (isHero) {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter app IDs or names (e.g., Facebook, Instagram, TikTok)..."
            className="w-full p-5 pr-28 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-2 h-[calc(100%-16px)] px-6 rounded-lg font-medium ${
              !input.trim() || isLoading
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
            }`}
          >
            {isLoading ? "Analyzing..." : "Compare"}
          </button>
        </form>
      </div>
    );
  }

  // Default floating input (fixed to bottom)
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-100 via-gray-100 to-transparent dark:from-gray-950 dark:via-gray-950 pt-6 pb-4 px-4">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter one or more Google Play app IDs separated by commas..."
            className="w-full p-4 pr-24 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-2 px-4 py-2 rounded-lg font-medium ${
              !input.trim() || isLoading
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            }`}
          >
            {isLoading ? "Analyzing..." : "Compare"}
          </button>
        </form>
      </div>
    </div>
  );
}
