"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import AvailabilitySlot from "@/models/Availability";

export type BookingFormData = {
  mentorId: string;
  slotId: string;
  type: "chat" | "video" | "call";
  timezone: string;
};

export async function bookSession(formData: BookingFormData) {
  const session = await auth();
  if (!session || !session.user) {
    return {
      error: "You must be logged in to book a session",
    };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        error: "User not found",
      };
    }

    // Find the availability slot
    const slot = await AvailabilitySlot.findById(formData.slotId);
    if (!slot) {
      return {
        error: "Time slot not found",
      };
    }

    // if (slot.isBooked) {
    //   return {
    //     error: "This time slot is already booked",
    //   };
    // }

    // Get the mentor profile to get pricing
    const mentorProfile = await Mentor.findOne({ userId: formData.mentorId });
    if (!mentorProfile) {
      return {
        error: "Mentor not found",
      };
    }

    // Calculate session duration in minutes (assuming format "HH:MM AM/PM")
    function parseTime(timeStr: string) {
      const [time, modifier] = timeStr.split(" ");
      const [hours, minutes] = time.split(":");

      let h = Number.parseInt(hours, 10);
      if (modifier === "PM" && h < 12) h += 12;
      if (modifier === "AM" && h === 12) h = 0;

      return { hours: h, minutes: Number.parseInt(minutes, 10) };
    }

    const startTime = parseTime(slot.startTime);
    const endTime = parseTime(slot.endTime);

    // Calculate duration in minutes
    const startMinutes = startTime.hours * 60 + startTime.minutes;
    const endMinutes = endTime.hours * 60 + endTime.minutes;
    const duration = endMinutes - startMinutes;

    // Get the price for the selected session type
    const price = mentorProfile.pricing[formData.type];

    // Create the session
    const newSession = new Session({
      mentorId: formData.mentorId,
      menteeId: user._id,
      type: formData.type,
      // date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration,
      timezone: formData.timezone,
      price,
      status: "pending",
    });

    await newSession.save();

    // Mark the availability slot as booked
    // slot.isBooked = true;
    await slot.save();

    revalidatePath(`/mentors/${formData.mentorId}`);
    revalidatePath("/dashboard/mentee");

    return {
      success: true,
      sessionId: newSession._id.toString(),
    };
  } catch (error) {
    console.error("Error booking session:", error);
    return {
      error: "Failed to book session",
    };
  }
}

export async function updateSessionStatus(
  sessionId: string,
  status: "confirmed" | "completed" | "cancelled"
) {
  const session = await auth();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        error: "User not found",
      };
    }

    // Find the session
    const sessionRecord = await Session.findById(sessionId);
    if (!sessionRecord) {
      return {
        error: "Session not found",
      };
    }

    // Check authorization based on role
    if (
      (session.user.role === "mentor" &&
        sessionRecord.mentorId.toString() !== user._id.toString()) ||
      (session.user.role === "user" &&
        sessionRecord.menteeId.toString() !== user._id.toString())
    ) {
      return {
        error: "You are not authorized to update this session",
      };
    }

    // Update the session status
    sessionRecord.status = status;
    await sessionRecord.save();

    // If cancelled, free up the availability slot
    if (status === "cancelled") {
      // Find the availability slot for this session
      const slot = await AvailabilitySlot.findOne({
        mentorId: sessionRecord.mentorId,
        date: sessionRecord.date,
        startTime: sessionRecord.startTime,
        endTime: sessionRecord.endTime,
      });

      if (slot) {
        // slot.isBooked = false;
        await slot.save();
      }
    }

    revalidatePath("/dashboard/mentor");
    revalidatePath("/dashboard/mentee");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating session status:", error);
    return {
      error: "Failed to update session status",
    };
  }
}
