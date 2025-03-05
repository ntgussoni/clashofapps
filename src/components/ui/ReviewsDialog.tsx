import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Star,
  StarHalf,
  UserIcon,
  Calendar,
  ThumbsUp,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ReviewsDialogProps {
  appName: string;
  feature?: string;
  reviews: ReviewItem[];
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function ReviewsDialog({
  appName,
  feature,
  reviews,
  children,
  title = "User Reviews",
  description,
}: ReviewsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "relevance">(
    "recent",
  );
  const [filterRating, setFilterRating] = useState<string>("all");

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      // Apply text search filter
      const matchesSearch =
        searchTerm === "" ||
        review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply rating filter
      const matchesRating =
        filterRating === "all" || review.score === parseInt(filterRating);

      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      // Sort based on selected criteria
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "rating") {
        return b.score - a.score;
      } else {
        // "relevance" - prioritize reviews mentioning the feature
        if (feature) {
          const aHasFeature = a.text
            .toLowerCase()
            .includes(feature.toLowerCase());
          const bHasFeature = b.text
            .toLowerCase()
            .includes(feature.toLowerCase());

          if (aHasFeature && !bHasFeature) return -1;
          if (!aHasFeature && bHasFeature) return 1;
        }
        return b.score - a.score;
      }
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
      <DialogContent className="max-h-[90vh] sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            {title}
            {feature && (
              <Badge variant="outline" className="ml-2">
                Feature: {feature}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {description ?? `Showing ${reviews.length} reviews for ${appName}`}
            {feature && ` related to "${feature}"`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Search and filter controls */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-[110px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Rating" />
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

              <Select
                value={sortBy}
                onValueChange={(value: "recent" | "rating" | "relevance") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  {feature && (
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Review count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>

          <Separator />

          {/* Reviews list */}
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {filteredReviews.length > 0 ? (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        {review.userImage ? (
                          <img
                            src={review.userImage}
                            alt={review.userName}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {review.date}
                            {review.version && (
                              <span className="ml-2">
                                Version: {review.version}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex">{renderStars(review.score)}</div>
                        {review.thumbsUp && review.thumbsUp > 0 && (
                          <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            {review.thumbsUp}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      {review.title && (
                        <div className="font-medium">
                          {highlightFeatureInText(review.title)}
                        </div>
                      )}
                      <div className="mt-1 text-sm">
                        {highlightFeatureInText(review.text)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No reviews match your filters.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
