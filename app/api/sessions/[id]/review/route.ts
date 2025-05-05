import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Mentor from "@/models/Mentor";
import { SessionStatus } from "@/types/session";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// POST /api/sessions/[id]/review
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "You must be logged in to submit a review" },
        { status: 401 }
      );
    }

    const { id: sessionId } = await params;
    const { rating, review } = await req.json();

    // Validate input
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!review || typeof review !== "string") {
      return NextResponse.json(
        { error: "Review text is required" },
        { status: 400 }
      );
    }

    // Find the session
    const sessionDoc = await Session.findById(sessionId);
    if (!sessionDoc) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify that the session belongs to the current user
    if (sessionDoc.menteeId.toString() !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to review this session" },
        { status: 403 }
      );
    }

    // Verify that the session is completed
    if (sessionDoc.status !== SessionStatus.COMPLETED) {
      return NextResponse.json(
        { error: "You can only review completed sessions" },
        { status: 400 }
      );
    }

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

    // Revalidate paths
    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath("/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

// GET /api/sessions/[id]/review
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: sessionId } = await params;

    // Find the session
    const sessionDoc = await Session.findById(sessionId)
      .populate("menteeId", "name image")
      .lean();

    if (!sessionDoc) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // If there's no review, return appropriate response
    if (!sessionDoc.rating || !sessionDoc.review) {
      return NextResponse.json(
        { error: "No review exists for this session" },
        { status: 404 }
      );
    }

    // Return the review data
    return NextResponse.json({
      sessionId: sessionDoc._id.toString(),
      menteeName: (sessionDoc.menteeId as any).name,
      menteeImage: (sessionDoc.menteeId as any).image || "",
      date: sessionDoc.updatedAt,
      rating: sessionDoc.rating,
      review: sessionDoc.review,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}
