"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import MentorWeeklyAvailability from "@/models/Availability";
import { z } from "zod";
import { SessionStatus } from "@/types/session";

// Validation schema for bookings
const bookingSchema = z.object({
  mentorId: z.string(),
  date: z.string(), // ISO date string: YYYY-MM-DD
  startTime: z.string(), // HH:MM
  endTime: z.string(), // HH:MM
  availabilityId: z.string(), // ID of the weekly availability slot
  meeting_type: z.enum(["chat", "video", "call"]),

  duration: z.number().min(30).max(240), // in minutes
  timezone: z.string(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

/**
 * Book a session with a mentor
 */
export async function bookSession(formData: BookingFormData) {
  const session = await auth();
  if (!session) {
    return {
      error: "You must be signed in to book a session",
    };
  }

  try {
    await connectDB();

    // Validate booking data early to fail fast
    const validatedData = bookingSchema.parse(formData);

    // Use a single query to fetch both mentor and mentee in parallel
    const [mentor, mentee] = await Promise.all([
      User.findById(validatedData.mentorId).lean(),
      User.findOne({ email: session.user.email }).lean(),
    ]);

    if (!mentor) {
      return { error: "Mentor not found" };
    }

    if (!mentee) {
      return { error: "Mentee account not found" };
    }

    // Check if the slot is actually available (including reservations)
    // This also includes the cleanup of expired reservations when needed
    const { isSessionAvailable } = await import("@/lib/utils/session-utils");
    const slotInfo = `${validatedData.mentorId}_${validatedData.date}_${validatedData.startTime}_${validatedData.endTime}`;
    const availabilityCheck = await isSessionAvailable(slotInfo);

    if (!availabilityCheck.available) {
      return {
        error:
          availabilityCheck.reason === "This time slot is temporarily reserved"
            ? "This slot is temporarily reserved by another user. Please try again in a few minutes or select a different time."
            : "This slot is no longer available.",
      };
    }

    // Fetch both availability and mentor profile in parallel
    const [weeklyAvailability, mentorProfile] = await Promise.all([
      MentorWeeklyAvailability.findOne({
        _id: validatedData.availabilityId,
        mentorId: mentor._id,
      }).lean(),
      Mentor.findOne({ userId: mentor._id }).lean(),
    ]);

    if (!weeklyAvailability) {
      return { error: "Time slot not available" };
    }

    if (!mentorProfile) {
      return { error: "Mentor profile not found" };
    }

    const hourlyRate = mentorProfile.pricing[validatedData.meeting_type];
    const price = (validatedData.duration / 60) * hourlyRate;

    // Create the booking record with an expiration time (20 minutes)
    const reservationExpires = new Date();
    reservationExpires.setMinutes(reservationExpires.getMinutes() + 20);

    // Use an optimized session creation
    const newSession = await Session.create({
      mentorId: mentor._id,
      menteeId: mentee._id,
      date: validatedData.date,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      meeting_type: validatedData.meeting_type,
      duration: validatedData.duration,
      timezone: validatedData.timezone,
      price: price,
      status: SessionStatus.RESERVED,
      reservationExpires: reservationExpires,
    });

    // Batch revalidate all affected paths
    const pathsToRevalidate = [
      "/dashboard/mentee",
      "/dashboard/mentor",
      `/mentors/${mentor._id}`,
    ];
    pathsToRevalidate.forEach((path) => revalidatePath(path));

    return {
      success: true,
      sessionId: newSession._id.toString(),
    };
  } catch (error) {
    console.error("Booking error:", error);

    if (error instanceof z.ZodError) {
      return {
        error: "Invalid booking data",
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    return {
      error: "Failed to book session",
    };
  }
}

/**
 * Get all booked sessions for the current user (as a mentee)
 */
export async function getMyBookedSessions() {
  const session = await auth();
  if (!session) {
    return [];
  }

  try {
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return [];
    }

    const sessions = await Session.find({
      menteeId: user._id,
    })
      .sort({ date: 1, startTime: 1 })
      .populate("mentorId", "name image");

    return sessions.map((s) => ({
      id: s._id.toString(),
      mentorId:
        typeof s.mentorId === "object" ? s.mentorId._id.toString() : s.mentorId,
      mentorName:
        typeof s.mentorId === "object" && "name" in s.mentorId
          ? s.mentorId.name
          : "Unknown",
      mentorImage:
        typeof s.mentorId === "object" && "image" in s.mentorId
          ? s.mentorId.image
          : null,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      type: s.meeting_type || "chat",
      duration: s.duration,
      price: s.price,
      status: s.status,
      timezone: s.timezone,
    }));
  } catch (error) {
    console.error("Error getting booked sessions:", error);
    return [];
  }
}

/**
 * Get all sessions for the current user (as a mentor)
 */
export async function getMentorSessions() {
  const session = await auth();
  if (!session || session.user.role !== "mentor") {
    return [];
  }

  try {
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return [];
    }

    const sessions = await Session.find({
      mentorId: user._id,
    })
      .sort({ date: 1, startTime: 1 })
      .populate("menteeId", "name image");

    return sessions.map((s) => ({
      id: s._id.toString(),
      menteeId:
        typeof s.menteeId === "object" ? s.menteeId._id.toString() : s.menteeId,
      menteeName:
        typeof s.menteeId === "object" && "name" in s.menteeId
          ? s.menteeId.name
          : "Unknown",
      menteeImage:
        typeof s.menteeId === "object" && "image" in s.menteeId
          ? s.menteeId.image
          : null,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      type: s.meeting_type || "chat",
      duration: s.duration,
      price: s.price,
      status: s.status,
      timezone: s.timezone,
    }));
  } catch (error) {
    console.error("Error getting mentor sessions:", error);
    return [];
  }
}

/**
 * Get all booked slots for a specific mentor to show as unavailable
 * This allows us to show already booked slots in the booking interface
 */
export async function getMentorBookedSlots(mentorId: string) {
  try {
    await connectDB();

    const now = new Date();

    // Optimize by combining all queries into one and using lean()
    const bookedSessions = await Session.find({
      mentorId: mentorId,
      $or: [
        { status: SessionStatus.CONFIRMED },
        {
          status: SessionStatus.RESERVED,
          reservationExpires: { $gt: now },
        },
      ],
    })
      .select("date startTime endTime") // Only select the fields we need
      .lean(); // Use lean for better performance

    // Format the date as string to match the expected BookedSlot type
    return bookedSessions.map((session) => ({
      date:
        typeof session.date === "string"
          ? session.date
          : session.date.toISOString().split("T")[0],
      startTime: session.startTime,
      endTime: session.endTime,
    }));
  } catch (error) {
    console.error("Error getting mentor booked slots:", error);
    return [];
  }
}
