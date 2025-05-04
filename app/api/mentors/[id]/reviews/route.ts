import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import mongoose from "mongoose";

// GET /api/mentors/[id]/reviews
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: mentorId } = await params;

    // Convert string ID to ObjectId
    const mentorObjectId = new mongoose.Types.ObjectId(mentorId);

    // Find all completed sessions with reviews for this mentor
    const sessions = await Session.find({
      mentorId: mentorObjectId,
      rating: { $exists: true, $ne: null },
      review: { $exists: true, $ne: "" },
    })
      .populate("menteeId", "name image")
      .sort({ updatedAt: -1 }) // Most recent first
      .lean();

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ reviews: [] });
    }

    // Transform the data for the frontend
    const reviews = sessions.map((session) => ({
      id: session._id.toString(),
      sessionId: session._id.toString(),
      menteeName: (session.menteeId as any).name,
      menteeImage: (session.menteeId as any).image || "",
      date: session.updatedAt,
      rating: session.rating,
      review: session.review,
    }));

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching mentor reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
