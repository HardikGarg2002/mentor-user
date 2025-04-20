import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredReservations } from "@/lib/utils/session-utils";

// Secret key to prevent unauthorized access
const API_SECRET = process.env.CLEANUP_API_SECRET || "default-cleanup-secret";

export async function GET(request: NextRequest) {
  // Check for authorization
  const authHeader = request.headers.get("authorization");
  const providedSecret = authHeader?.split(" ")[1];

  if (providedSecret !== API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Run the cleanup
    const result = await cleanupExpiredReservations();

    return NextResponse.json({
      success: true,
      message: `Cleanup completed: ${result.deletedCount} sessions deleted, ${result.extendedCount} sessions extended`,
      ...result,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run cleanup" },
      { status: 500 }
    );
  }
}

// PUT, POST, or any other method for webhook-based triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
