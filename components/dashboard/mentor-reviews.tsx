"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import Link from "next/link";
import { StarRating } from "./ui-helpers";
import { getMentorReviews } from "@/actions/review-actions";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  sessionId: string;
  menteeName: string;
  menteeImage: string;
  date: string | Date;
  rating: number;
  review: string;
}

interface MentorReviewsProps {
  mentorId: string;
}

// Mock function to format dates for demo purposes
const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
export function MentorReviews({ mentorId }: MentorReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        setIsLoading(true);
        setError(null);

        const mentorReviews = await getMentorReviews(mentorId);
        setReviews(mentorReviews);
      } catch (err) {
        console.error("Failed to load reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    if (mentorId) {
      loadReviews();
    }
  }, [mentorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews & Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className="h-4 w-4 mr-1" />
                  ))}
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-28" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={review.menteeImage}
                        alt={review.menteeName}
                      />
                      <AvatarFallback>
                        {review.menteeName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{review.menteeName}</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.date)}
                  </p>
                </div>
                <div className="mb-2">
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-gray-700 mb-4">{review.review}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                  asChild
                >
                  <Link href={`/sessions/${review.sessionId}`}>
                    <Eye className="h-3 w-3" />
                    <span>View Session</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No reviews yet</p>
        )}
      </CardContent>
    </Card>
  );
}
