import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import { sendSessionReminderEmails } from "@/lib/session-emails";
import { SessionStatus } from "@/types/session";
import { addHours, isWithinInterval } from "date-fns";

// Verify the cron job secret to ensure only authorized calls
const verifyCronSecret = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;

  const [type, secret] = authHeader.split(" ");
  return type === "Bearer" && secret === process.env.CRON_SECRET;
};

export async function POST(req: NextRequest) {
  try {
    // Verify the request is authorized
    if (!verifyCronSecret(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all confirmed sessions scheduled for the next 24 hours
    const now = new Date();
    const twentyFourHoursFromNow = addHours(now, 24);

    const upcomingSessions = await Session.find({
      status: SessionStatus.CONFIRMED,
      date: {
        $gte: now,
        $lte: twentyFourHoursFromNow,
      },
    }).select("_id");

    console.log(
      `Found ${upcomingSessions.length} sessions to send reminders for`
    );

    // Send reminders for each session
    const results = await Promise.allSettled(
      upcomingSessions.map((session) =>
        sendSessionReminderEmails(session._id.toString())
      )
    );

    // Count successes and failures
    const successCount = results.filter(
      (result) => result.status === "fulfilled" && result.value.success
    ).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      total: results.length,
      successful: successCount,
      failed: failureCount,
    });
  } catch (error) {
    console.error("Error sending session reminders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
