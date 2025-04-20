"use server";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import { SessionStatus } from "@/types/session";

/**
 * Cleanup expired session reservations
 */
export async function cleanupExpiredReservations() {
  try {
    await connectDB();

    const now = new Date();

    // Find sessions with expired reservations
    const sessionsToCleanup = await Session.find({
      reservationExpires: { $lt: now },
      status: SessionStatus.RESERVED, // Only target sessions with reserved status
    });

    console.log(
      `Found ${sessionsToCleanup.length} expired reservations to clean up`
    );

    // Delete all expired reservations - simpler approach
    if (sessionsToCleanup.length > 0) {
      const result = await Session.deleteMany({
        _id: { $in: sessionsToCleanup.map((session) => session._id) },
      });

      return {
        success: true,
        deletedCount: result.deletedCount || 0,
        totalProcessed: sessionsToCleanup.length,
      };
    }

    return {
      success: true,
      deletedCount: 0,
      totalProcessed: 0,
    };
  } catch (error) {
    console.error("Error cleaning up expired reservations:", error);
    return { success: false, error };
  }
}

/**
 * Check if a session slot is available for booking
 * @param slotInfo - String in format "mentorId_date_startTime_endTime"
 * @param userId - Optional user ID checking availability
 */
export async function isSessionAvailable(slotInfo: string, userId?: string) {
  try {
    await connectDB();

    // First, clean up any expired reservations
    await cleanupExpiredReservations();

    // Parse the slot information
    const [mentorId, dateStr, startTime, endTime] = slotInfo.split("_");

    if (!mentorId || !dateStr || !startTime || !endTime) {
      return { available: false, reason: "Invalid slot information" };
    }

    // Check if there are any existing sessions that overlap with this time slot
    const existingSessions = await Session.find({
      mentorId,
      date: dateStr,
      $or: [
        // Check if any existing session overlaps with the new one
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gt: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
        {
          $and: [
            { startTime: { $gte: startTime } },
            { endTime: { $lte: endTime } },
          ],
        },
      ],
    });

    // If there are confirmed sessions, the slot is not available
    const confirmedSessions = existingSessions.filter(
      (session) => session.status === SessionStatus.CONFIRMED
    );

    if (confirmedSessions.length > 0) {
      return { available: false, reason: "This time slot is already booked" };
    }

    // Check for reservations
    const now = new Date();
    const reservedSessions = existingSessions.filter(
      (session) =>
        session.status === SessionStatus.RESERVED &&
        session.reservationExpires &&
        session.reservationExpires > now
    );

    if (reservedSessions.length > 0) {
      // Check if this slot is reserved by the current user
      if (userId) {
        const userReservedSession = reservedSessions.find(
          (session) => session.menteeId.toString() === userId
        );

        if (userReservedSession) {
          return {
            available: true,
            reservedForCurrentUser: true,
            reservationExpires: userReservedSession.reservationExpires,
          };
        }
      }

      // Slot is reserved by someone else
      return {
        available: false,
        reason: "This time slot is temporarily reserved",
        expiresAt: reservedSessions[0].reservationExpires,
      };
    }

    // Slot is available
    return { available: true };
  } catch (error) {
    console.error("Error checking session availability:", error);
    return { available: false, reason: "Error checking availability" };
  }
}
