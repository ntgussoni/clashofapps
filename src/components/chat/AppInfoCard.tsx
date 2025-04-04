import Image from "next/image";
import {
  Star,
  Download,
  Calendar,
  RefreshCw,
  DollarSign,
  Shield,
} from "lucide-react";
import { type App } from "@prisma/client";

// Define type for raw app data
interface RawAppData {
  developerWebsite?: string;
  released?: string;
  updated?: number;
  androidVersionText?: string;
  size?: string;
  offersIAP?: boolean;
  IAPRange?: string;
  contentRating?: string;
  contentRatingDescription?: string;
}

interface AppCardProps {
  appInfo: App;
  accentColor?: "blue" | "rose";
}

export default function AppCard({
  appInfo,
  accentColor = "blue",
}: AppCardProps) {
  // Access raw data if available (contains all Google Play info)
  const rawData = appInfo.rawData as RawAppData;

  // Helper function to get color classes based on accent color
  const getColorClasses = () => {
    if (accentColor === "rose") {
      return {
        bgLight: "bg-rose-50/30",
        bg: "bg-rose-600",
        iconBg: "bg-rose-100",
        iconBorder: "border-rose-200",
        iconText: "text-rose-500",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-600",
        badgeBorder: "border-rose-100",
      };
    }
    return {
      bgLight: "bg-blue-50/30",
      bg: "bg-blue-600",
      iconBg: "bg-blue-100",
      iconBorder: "border-blue-200",
      iconText: "text-blue-500",
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-600",
      badgeBorder: "border-blue-100",
    };
  };

  const colors = getColorClasses();

  // Format installs to be more readable
  const formatInstalls = (installs: string) => {
    if (!installs) return "Unknown";
    return installs.replace(/\+$/, "") + "+";
  };

  // Format date from timestamp (for updated date)
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get main category (first one)
  const mainCategory =
    (appInfo.categories as { id: string; name: string }[])?.[0]?.name ?? "App";

  return (
    <div className="min-w-[600px] overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div
        className={`flex items-center space-x-4 border-b border-gray-200 p-6 ${colors.bgLight}`}
      >
        <div className="relative h-16 w-16 flex-shrink-0">
          {appInfo.icon ? (
            <div
              className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border ${colors.iconBorder}`}
            >
              <Image
                src={appInfo.icon}
                alt={`${appInfo.name} icon`}
                width={64}
                height={64}
                className="h-16 w-16 object-cover"
              />
            </div>
          ) : (
            <div
              className={`h-16 w-16 ${colors.iconBg} flex items-center justify-center overflow-hidden rounded-xl border ${colors.iconBorder}`}
            >
              <div className={colors.iconText}>
                {accentColor === "rose" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-10 w-10"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-10 w-10"
                  >
                    <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.76121C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2ZM12 8C13.5913 8 15.1174 8.63214 16.2426 9.75736C17.3679 10.8826 18 12.4087 18 14C18 15.5913 17.3679 17.1174 16.2426 18.2426C15.1174 19.3679 13.5913 20 12 20C10.4087 20 8.88258 19.3679 7.75736 18.2426C6.63214 17.1174 6 15.5913 6 14C6 12.4087 6.63214 10.8826 7.75736 9.75736C8.88258 8.63214 10.4087 8 12 8Z" />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {appInfo.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{appInfo.developer}</p>
          <p className="mt-1 text-xs text-gray-400">
            {appInfo.description.slice(0, 40) + "..."}
          </p>
        </div>
        <div
          className={`flex items-center ${colors.bg} rounded-lg px-3 py-1.5 text-white`}
        >
          <Star className="mr-1 h-4 w-4 fill-yellow-300 stroke-yellow-300" />
          <span className="font-medium">
            {typeof appInfo.score === "number"
              ? appInfo.score.toFixed(1)
              : Number(appInfo.score).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 p-6">
        <div className="flex items-center space-x-3">
          <Star className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {appInfo.reviews?.toLocaleString() ?? "Unknown"}
            </p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Download className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {appInfo.installs ? formatInstalls(appInfo.installs) : "Unknown"}
            </p>
            <p className="text-xs text-gray-500">Installs</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {rawData?.released ?? "Unknown"}
            </p>
            <p className="text-xs text-gray-500">Released</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <RefreshCw className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {rawData?.updated ? formatDate(rawData.updated) : "Unknown"}
            </p>
            <p className="text-xs text-gray-500">Updated</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex h-5 w-5 items-center justify-center text-gray-400">
            <span className="text-xs font-bold">v</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {appInfo.version ?? "Unknown"}
            </p>
            <p className="text-xs text-gray-500">Version</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {rawData?.offersIAP ? (rawData.IAPRange ?? "Yes") : "No"}
            </p>
            <p className="text-xs text-gray-500">In-App Purchases</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-6 pb-6 pt-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">
            {rawData?.contentRating ?? "Unknown"}
          </span>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-medium ${colors.badgeBg} ${colors.badgeText} border ${colors.badgeBorder}`}
        >
          {mainCategory}
        </div>
      </div>
    </div>
  );
}
