import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Mentor from "@/models/Mentor";
import { SessionStatus } from "@/types/session";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Constants, PATHS } from "@/config";

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
        {
          error: "You must be logged in to submit a review",
          code: Constants.ERROR_CODES.AUTH_FAILED,
        },
        { status: Constants.API_RESPONSES.UNAUTHORIZED.CODE }
      );
    }

    const { id: sessionId } = await params;
    const { rating, review } = await req.json();

    // Validate input
    if (
      !rating ||
      typeof rating !== "number" ||
      rating < Constants.RATING_LEVELS.POOR ||
      rating > Constants.RATING_LEVELS.EXCELLENT
    ) {
      return NextResponse.json(
        {
          error: `Rating must be between ${Constants.RATING_LEVELS.POOR} and ${Constants.RATING_LEVELS.EXCELLENT}`,
          code: Constants.ERROR_CODES.VALIDATION_ERROR,
        },
        { status: Constants.API_RESPONSES.BAD_REQUEST.CODE }
      );
    }

    if (!review || typeof review !== "string") {
      return NextResponse.json(
        {
          error: "Review text is required",
          code: Constants.ERROR_CODES.VALIDATION_ERROR,
        },
        { status: Constants.API_RESPONSES.BAD_REQUEST.CODE }
      );
    }

    // Find the session
    const sessionDoc = await Session.findById(sessionId);
    if (!sessionDoc) {
      return NextResponse.json(
        {
          error: "Session not found",
          code: Constants.ERROR_CODES.SESSION_NOT_FOUND,
        },
        { status: Constants.API_RESPONSES.NOT_FOUND.CODE }
      );
    }

    // Verify that the session belongs to the current user
    if (sessionDoc.menteeId.toString() !== user.id) {
      return NextResponse.json(
        {
          error: "You are not authorized to review this session",
          code: Constants.ERROR_CODES.AUTH_FAILED,
        },
        { status: Constants.API_RESPONSES.FORBIDDEN.CODE }
      );
    }

    // Verify that the session is completed
    if (sessionDoc.status !== SessionStatus.COMPLETED) {
      return NextResponse.json(
        {
          error: "You can only review completed sessions",
          code: Constants.ERROR_CODES.VALIDATION_ERROR,
        },
        { status: Constants.API_RESPONSES.BAD_REQUEST.CODE }
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
    revalidatePath(`${PATHS.SESSIONS}/${sessionId}`);
    revalidatePath(PATHS.DASHBOARD);
    revalidatePath(`${PATHS.DASHBOARD}/mentor`);
    revalidatePath(`${PATHS.DASHBOARD}/mentee`);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      {
        error: "Failed to submit review",
        code: Constants.ERROR_CODES.DATABASE_ERROR,
      },
      { status: Constants.API_RESPONSES.SERVER_ERROR.CODE }
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
      return NextResponse.json(
        {
          error: "Session not found",
          code: Constants.ERROR_CODES.SESSION_NOT_FOUND,
        },
        { status: Constants.API_RESPONSES.NOT_FOUND.CODE }
      );
    }

    // If there's no review, return appropriate response
    if (!sessionDoc.rating || !sessionDoc.review) {
      return NextResponse.json(
        {
          error: "No review exists for this session",
          code: Constants.ERROR_CODES.SESSION_NOT_FOUND,
        },
        { status: Constants.API_RESPONSES.NOT_FOUND.CODE }
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
      {
        error: "Failed to fetch review",
        code: Constants.ERROR_CODES.DATABASE_ERROR,
      },
      { status: Constants.API_RESPONSES.SERVER_ERROR.CODE }
    );
  }
}
