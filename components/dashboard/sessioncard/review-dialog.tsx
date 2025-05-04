"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { submitReview } from "@/actions/review-actions";
import { toast } from "sonner";

// Star icon component for the interactive rating
const StarIcon = ({
  filled,
  hovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  filled: boolean;
  hovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <svg
      className={`h-6 w-6 cursor-pointer ${
        filled
          ? "text-yellow-500 fill-yellow-500"
          : hovered
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300"
      }`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
};

// Form schema validation
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  review: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review cannot exceed 500 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewDialogProps {
  sessionId: string;
  mentorName: string;
  children: React.ReactNode;
  onSubmitReview?: (sessionId: string, data: ReviewFormValues) => Promise<void>;
}

export function ReviewDialog({
  sessionId,
  mentorName,
  children,
  onSubmitReview,
}: ReviewDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      review: "",
    },
  });

  const rating = form.watch("rating");

  async function onSubmit(data: ReviewFormValues) {
    try {
      setIsSubmitting(true);

      if (onSubmitReview) {
        // Use custom submission handler if provided (for demo/testing)
        await onSubmitReview(sessionId, data);
      } else {
        // Use server action for real submissions
        const result = await submitReview(sessionId, data.rating, data.review);

        if (!result || !result.success) {
          throw new Error("Failed to submit review");
        }
      }

      toast.success("Review submitted successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review for {mentorName}</DialogTitle>
          <DialogDescription>
            Share your experience to help other mentees find great mentors.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          filled={field.value >= star}
                          hovered={hoveredRating >= star}
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with this mentor..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
