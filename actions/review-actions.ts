"use server";

import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Mentor from "@/models/Mentor";
import { SessionStatus } from "@/types/session";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * Submit a review for a completed session
 */
export async function submitReview(
  sessionId: string,
  rating: number,
  review: string
) {
  try {
    await connectDB();
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      throw new Error("You must be logged in to submit a review");
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Find the session
    const sessionDoc = await Session.findById(sessionId);
    if (!sessionDoc) {
      throw new Error("Session not found");
    }

    // Verify that the session belongs to the current user
    if (sessionDoc.menteeId.toString() !== user.id) {
      throw new Error("You are not authorized to review this session");
    }

    // Verify that the session is completed
    // if (sessionDoc.status !== SessionStatus.COMPLETED) {
    //   throw new Error("You can only review completed sessions");
    // }

    // Update the session with the review
    sessionDoc.rating = rating;
    sessionDoc.review = review;
    await sessionDoc.save();

    // Update the mentor's average rating
    const mentorId = sessionDoc.mentorId;
    const mentorSessions = await Session.find({
      mentorId,
      rating: { $exists: true, $ne: null },
    });

    const totalRatings = mentorSessions.length;
    const sumRatings = mentorSessions.reduce(
      (sum, session) => sum + (session.rating || 0),
      0
    );
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Update the mentor's profile with the new average rating
    await Mentor.findOneAndUpdate(
      { userId: mentorId },
      { rating: parseFloat(averageRating.toFixed(1)) }
    );

    // Revalidate relevant pages
    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error submitting review:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to submit review"
    );
  }
}

/**
 * Get reviews for a mentor
 */
export async function getMentorReviews(mentorId: string) {
  try {
    await connectDB();

    // Convert string ID to ObjectId if needed
    const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

    // Find all sessions with reviews for this mentor
    const reviews = await Session.find({
      mentorId: mentorObjectId,
      rating: { $exists: true, $ne: null },
      review: { $exists: true, $ne: "" },
    })
      .populate("menteeId", "name image") // Get mentee details
      .sort({ updatedAt: -1 }) // Most recent first
      .lean();

    return reviews.map((review) => ({
      id: review._id.toString(),
      sessionId: review._id.toString(),
      menteeName: (review.menteeId as any).name,
      menteeImage: (review.menteeId as any).image || "",
      date: review.updatedAt,
      rating: review.rating,
      review: review.review,
    }));
  } catch (error) {
    console.error("Error fetching mentor reviews:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch mentor reviews"
    );
  }
}

/**
 * Check if a user has already reviewed a session
 */
export async function hasReviewedSession(sessionId: string) {
  try {
    await connectDB();
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return false;
    }

    const sessionDoc = await Session.findById(sessionId);
    if (!sessionDoc) {
      return false;
    }

    return (
      sessionDoc.menteeId.toString() === user.id &&
      sessionDoc.rating !== undefined &&
      sessionDoc.rating !== null
    );
  } catch (error) {
    console.error("Error checking review status:", error);
    return false;
  }
}
