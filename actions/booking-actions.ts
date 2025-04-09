"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import MentorWeeklyAvailability from "@/models/Availability";
import { z } from "zod";

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

    // Validate booking data
    const validatedData = bookingSchema.parse(formData);

    // Get the mentor and mentee user records
    const mentor = await User.findById(validatedData.mentorId);
    const mentee = await User.findOne({ email: session.user.email });

    if (!mentor) {
      return {
        error: "Mentor not found",
      };
    }

    if (!mentee) {
      return {
        error: "Mentee account not found",
      };
    }

    // Verify the weekly availability exists and belongs to the mentor
    const weeklyAvailability = await MentorWeeklyAvailability.findOne({
      _id: validatedData.availabilityId,
      mentorId: mentor._id,
    });

    if (!weeklyAvailability) {
      return {
        error: "Time slot not available",
      };
    }

    // Check if the requested slot is already booked
    const existingBooking = await Session.findOne({
      mentorId: mentor._id,
      date: validatedData.date,
      $or: [
        // Check if any existing booking overlaps with the new one
        {
          $and: [
            { startTime: { $lte: validatedData.startTime } },
            { endTime: { $gt: validatedData.startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lt: validatedData.endTime } },
            { endTime: { $gte: validatedData.endTime } },
          ],
        },
        {
          $and: [
            { startTime: { $gte: validatedData.startTime } },
            { endTime: { $lte: validatedData.endTime } },
          ],
        },
      ],
    });

    if (existingBooking) {
      return {
        error: "This time slot is already booked",
      };
    }

    // Calculate the price based on duration and type
    const mentorProfile = await Mentor.findOne({ userId: mentor._id });

    if (!mentorProfile) {
      return {
        error: "Mentor profile not found",
      };
    }

    const hourlyRate = mentorProfile.pricing[validatedData.meeting_type];
    const price = (validatedData.duration / 60) * hourlyRate;

    // Create the booking record
    const newSession = new Session({
      mentorId: mentor._id,
      menteeId: mentee._id,
      date: validatedData.date,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      meeting_type: validatedData.meeting_type,
      duration: validatedData.duration,
      timezone: validatedData.timezone,
      price: price,
      status: "pending",
    });

    await newSession.save();

    // Revalidate relevant paths
    revalidatePath("/dashboard/mentee");
    revalidatePath("/dashboard/mentor");
    revalidatePath(`/mentors/${mentor._id}`);

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

    const sessions = await Session.find({
      mentorId: mentorId,
      status: { $in: ["scheduled", "confirmed"] },
    }).select("date startTime endTime");

    return sessions.map((s) => ({
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    }));
  } catch (error) {
    console.error("Error getting mentor booked slots:", error);
    return [];
  }
}
