import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, StarHalf, ThumbsUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, SearchX } from "lucide-react";
import { api } from "@/trpc/react";

// Types for reviews
interface ReviewItem {
  id: string;
  reviewId: string;
  userName: string;
  userImage?: string | null;
  date: string;
  score: number;
  title?: string | null;
  text: string;
  thumbsUp?: number | null;
  version?: string | null;
}

// Interface for the raw review data from API
interface ApiReview {
  id: number;
  userName: string;
  userImage?: string | null;
  date?: string;
  score: number;
  title?: string | null;
  text: string;
  thumbsUp?: number | null;
  version?: string | null;
}

interface ReviewsDialogProps {
  appName: string;
  feature?: string;
  reviewIds: number[];
  children: React.ReactNode;
  title?: string;
  description?: string;
}

// Add a ReviewSkeleton component for loading state
const ReviewSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-gray-200"></div>
          <div className="flex">
            <div className="h-3 w-20 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="ml-auto">
          <div className="h-5 w-16 rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="h-3 w-full rounded bg-gray-200"></div>
        <div className="h-3 w-3/4 rounded bg-gray-200"></div>
        <div className="h-3 w-5/6 rounded bg-gray-200"></div>
      </div>

      <div className="flex justify-between">
        <div className="h-4 w-16 rounded bg-gray-200"></div>
        <div className="h-4 w-10 rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

// Type for sortBy state
type SortOption = "recent" | "rating" | "relevance";

export function ReviewsDialog({
  appName,
  feature,
  reviewIds,
  children,
  title = "User Reviews",
  description,
}: ReviewsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterRating, setFilterRating] = useState<string>("all");

  // Add review loading logic
  const { data: reviews, isLoading } = api.reviews.getReviewsByIds.useQuery(
    { reviewIds },
    { enabled: reviewIds.length > 0 },
  );

  // Process reviews into the required format
  const processedReviews: ReviewItem[] = React.useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return [];
    }

    return reviews.map((review: ApiReview) => ({
      id: String(review.id),
      reviewId: String(review.id),
      userName: review.userName || "Anonymous",
      userImage: review.userImage,
      date: review.date
        ? new Date(review.date).toLocaleDateString()
        : new Date().toLocaleDateString(),
      score: review.score,
      title: review.title,
      text: review.text,
      thumbsUp: review.thumbsUp,
      version: review.version,
    }));
  }, [reviews]);

  // Filter and sort reviews
  const filteredReviews = processedReviews
    .filter((review) => {
      // Apply rating filter
      if (filterRating !== "all" && review.score !== parseInt(filterRating)) {
        return false;
      }

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          review.text.toLowerCase().includes(searchLower) ||
          (review.title?.toLowerCase().includes(searchLower) ?? false) ||
          review.userName.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "rating") {
        return b.score - a.score;
      }
      // For relevance or default, we keep the original order
      return 0;
    });

  // Helper to render stars
  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  // Highlight mentioned feature in review text
  const highlightFeatureInText = (text: string) => {
    if (!feature) return text;

    const regex = new RegExp(`(${feature})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (part.toLowerCase() === feature.toLowerCase()) {
        return (
          <span
            key={i}
            className="rounded bg-yellow-100 px-1 dark:bg-yellow-900/40"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto sm:max-w-[700px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          {/* App info */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`/app-icons/${appName.toLowerCase()}.png`}
                  alt={appName}
                />
                <AvatarFallback>{appName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{appName}</h3>
              {feature && (
                <p className="text-sm text-gray-500">Feature: {feature}</p>
              )}
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search reviews..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-4">
            {isLoading ? (
              // Show skeleton loading UI when loading
              Array.from({ length: 3 }).map((_, index) => (
                <ReviewSkeleton key={`skeleton-${index}`} />
              ))
            ) : filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        {review.userImage ? (
                          <AvatarImage
                            src={review.userImage}
                            alt={review.userName}
                          />
                        ) : (
                          <AvatarFallback>
                            {(review.userName?.charAt(0) || "U").toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{review.userName}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {review.date}
                          {review.version && (
                            <>
                              <span className="mx-1">•</span>
                              <span>v{review.version}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.score)}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    {review.title && (
                      <h5 className="font-medium">{review.title}</h5>
                    )}
                    <p className="text-sm text-gray-700">
                      {review.text
                        ? feature
                          ? highlightFeatureInText(review.text.toString())
                          : review.text.toString()
                        : "No review text available"}
                    </p>
                  </div>

                  {review.thumbsUp !== null &&
                    review.thumbsUp !== undefined && (
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        {review.thumbsUp} found this helpful
                      </div>
                    )}
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 p-6 text-center">
                <SearchX className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No reviews found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {reviewIds.length === 0
                    ? "There are no reviews available for this selection."
                    : "Try adjusting your filters or search term."}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
