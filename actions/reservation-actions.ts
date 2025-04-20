"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import { SessionStatus } from "@/types/session";

/**
 * Get reservation status for a session
 * This can be used to check if a session is still reserved
 */
export async function getReservationStatus(sessionId: string) {
  const session = await auth();
  if (!session || !session.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();

    // Run cleanup to ensure clean state
    const { cleanupExpiredReservations } = await import(
      "@/lib/utils/session-utils"
    );
    await cleanupExpiredReservations();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Find the session
    const sessionRecord = await Session.findById(sessionId);
    if (!sessionRecord) {
      return {
        success: false,
        error: "Session not found",
        status: "not_found",
      };
    }

    // Check if user is authorized to view this session
    if (!sessionRecord.menteeId.equals(currentUser._id)) {
      return {
        success: false,
        error: "You are not authorized to view this session",
      };
    }

    // Check session status
    if (sessionRecord.status === SessionStatus.CONFIRMED) {
      return {
        success: true,
        status: "confirmed",
      };
    }

    if (sessionRecord.status === SessionStatus.RESERVED) {
      // Check if reservation has expired
      const now = new Date();
      if (
        sessionRecord.reservationExpires &&
        sessionRecord.reservationExpires > now
      ) {
        return {
          success: true,
          status: "reserved",
          expiresAt: sessionRecord.reservationExpires,
        };
      } else {
        return {
          success: true,
          status: "expired",
        };
      }
    }

    return {
      success: true,
      status: sessionRecord.status,
    };
  } catch (error) {
    console.error("Error checking reservation status:", error);
    return {
      success: false,
      error: "Failed to check reservation status",
    };
  }
}
