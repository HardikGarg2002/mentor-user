"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StarRating } from "../ui-helpers";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedbackDialogProps {
  menteeName: string;
  sessionId?: string;
  rating?: number;
  review?: string;
  children: React.ReactNode;
}

interface FeedbackData {
  menteeName: string;
  rating: number;
  review: string;
}

export function FeedbackDialog({
  menteeName,
  sessionId,
  rating,
  review,
  children,
}: FeedbackDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);

  // Load review data if not provided directly
  useEffect(() => {
    async function fetchReviewData() {
      if (!sessionId || (rating !== undefined && review !== undefined)) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/sessions/${sessionId}/review`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("No feedback available for this session.");
          } else {
            throw new Error(`Error fetching review: ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        setFeedbackData({
          menteeName: data.menteeName,
          rating: data.rating,
          review: data.review,
        });
      } catch (err) {
        console.error("Failed to fetch review:", err);
        setError("Failed to load feedback. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (open) {
      fetchReviewData();
    }
  }, [sessionId, rating, review, open]);

  // Use provided data or fetched data
  const displayName = feedbackData?.menteeName || menteeName;
  const displayRating = feedbackData?.rating || rating;
  const displayReview = feedbackData?.review || review;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Feedback from {displayName}</DialogTitle>
          <DialogDescription>
            Review and rating provided by your mentee.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-4 space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-4 mr-1" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-muted-foreground">{error}</div>
        ) : (
          <div className="py-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Rating</h4>
              <StarRating rating={displayRating!} />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Feedback</h4>
              <p className="text-sm text-gray-700 border p-3 rounded-md bg-gray-50">
                {displayReview}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
