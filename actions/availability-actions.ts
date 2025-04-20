"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import MentorWeeklyAvailability from "@/models/Availability";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Validation schema for time format (HH:MM)
const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Validation schema for time slots
const timeSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z
    .string()
    .regex(timeFormatRegex, "Invalid time format. Use HH:MM"),
  endTime: z.string().regex(timeFormatRegex, "Invalid time format. Use HH:MM"),
  timezone: z.string().optional(),
});

// Helper function to convert time string to minutes for comparison
// This is a utility function, not a server action, so don't export it
function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Add a new time slot to a mentor's weekly availability
 */
export async function addTimeSlot(formData: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone?: string;
}) {
  const session = await auth();
  if (!session || session.user.role !== "mentor") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    // Validate form data
    const validatedData = timeSlotSchema.parse(formData);

    // Validate that start time is before end time
    const startMinutes = convertTimeToMinutes(validatedData.startTime);
    const endMinutes = convertTimeToMinutes(validatedData.endTime);

    if (startMinutes >= endMinutes) {
      return {
        success: false,
        error: "End time must be after start time",
      };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check for overlapping time slots
    const existingSlots = await MentorWeeklyAvailability.find({
      mentorId: user._id,
      dayOfWeek: validatedData.dayOfWeek,
    });

    const isOverlapping = existingSlots.some((slot) => {
      const slotStartMinutes = convertTimeToMinutes(slot.startTime);
      const slotEndMinutes = convertTimeToMinutes(slot.endTime);

      return (
        (startMinutes >= slotStartMinutes && startMinutes < slotEndMinutes) ||
        (endMinutes > slotStartMinutes && endMinutes <= slotEndMinutes) ||
        (startMinutes <= slotStartMinutes && endMinutes >= slotEndMinutes)
      );
    });

    if (isOverlapping) {
      return {
        success: false,
        error: "Time slot overlaps with an existing slot",
      };
    }

    // Create the new time slot
    const newTimeSlot = new MentorWeeklyAvailability({
      mentorId: user._id,
      dayOfWeek: validatedData.dayOfWeek,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      timezone: validatedData.timezone || "Asia/Calcutta", // Default timezone
    });

    await newTimeSlot.save();

    revalidatePath("/dashboard/mentor/availability");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error adding time slot:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data",
        fieldErrors: error.flatten().fieldErrors,
      };
    }
    return {
      success: false,
      error: "Failed to add time slot",
    };
  }
}

/**
 * Delete a time slot from a mentor's weekly availability
 */
export async function deleteTimeSlot(timeSlotId: string) {
  const session = await auth();
  if (!session || session.user.role !== "mentor") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Find and delete the time slot
    const timeSlot = await MentorWeeklyAvailability.findOne({
      _id: timeSlotId,
      mentorId: user._id,
    });

    if (!timeSlot) {
      return {
        success: false,
        error: "Time slot not found",
      };
    }

    await timeSlot.deleteOne();

    revalidatePath("/dashboard/mentor/availability");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return {
      success: false,
      error: "Failed to delete time slot",
    };
  }
}

/**
 * Get available time slots for a specific mentor
 */
export async function getMentorWeeklyAvailabilityById({
  mentorId,
}: {
  mentorId: string;
}) {
  try {
    await connectDB();
    console.log("Mentor ID:", mentorId);
    const timeSlots = await MentorWeeklyAvailability.find({
      mentorId: mentorId,
    }).sort({ dayOfWeek: 1, startTime: 1 });

    return timeSlots.map((slot) => ({
      id: slot._id.toString(),
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      timezone: slot.timezone,
    }));
  } catch (error) {
    console.error("Error getting mentor weekly availability:", error);
    return [];
  }
}

/**
 * Get all time slots for a mentor's weekly availability
 */
export async function getMentorWeeklyAvailability() {
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

    const timeSlots = await MentorWeeklyAvailability.find({
      mentorId: user._id,
    }).sort({ dayOfWeek: 1, startTime: 1 });

    return timeSlots.map((slot) => ({
      id: slot._id.toString(),
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      timezone: slot.timezone,
    }));
  } catch (error) {
    console.error("Error getting mentor weekly availability:", error);
    return [];
  }
}
