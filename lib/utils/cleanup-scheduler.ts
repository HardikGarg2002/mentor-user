"use server";

import { cleanupExpiredReservations } from "@/lib/utils/session-utils";

/**
 * Schedule periodic cleanup of expired reservations
 * This should be called when the server starts
 */
export function scheduleReservationCleanup() {
  // Run the cleanup immediately when the server starts
  runCleanup();

  // Schedule to run every 5 minutes
  setInterval(runCleanup, 5 * 60 * 1000);
}

/**
 * Run the cleanup process
 */
async function runCleanup() {
  try {
    console.log("Running session reservation cleanup...");
    const result = await cleanupExpiredReservations();

    if (result.success) {
      console.log(
        `Cleanup complete: ${result.deletedCount} sessions deleted, ${result.resetCount} sessions reset`
      );
    } else {
      console.error("Cleanup failed:", result.error);
    }
  } catch (error) {
    console.error("Error in cleanup process:", error);
  }
}
