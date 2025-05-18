import {
  sendEmail,
  createSessionConfirmationEmailHtml,
  createSessionReminderEmailHtml,
} from "./email";
import connectDB from "./db";
import User from "@/models/User";
import Session from "@/models/Session";
import { format } from "date-fns";

export async function sendSessionConfirmationEmails(sessionId: string) {
  try {
    await connectDB();

    // Get session details with populated user information
    const session: any = await Session.findById(sessionId)
      .populate("mentorId", "name email")
      .populate("menteeId", "name email");

    if (!session) {
      throw new Error("Session not found");
    }

    const sessionDate = format(new Date(session.date), "EEEE, MMMM d, yyyy");
    const sessionTime = `${session.startTime} - ${session.endTime}`;
    const duration = `${session.duration} minutes`;

    const sessionDetails = {
      date: sessionDate,
      time: sessionTime,
      duration,
      mentorName: session.mentorId.name,
      topic: session.meeting_type,
      meetingLink: session.meetingLink, // If you have meeting links
    };

    // Send confirmation to mentee
    await sendEmail({
      to: session.menteeId.email,
      subject: "Session Confirmation",
      html: createSessionConfirmationEmailHtml(
        session.menteeId.name,
        sessionDetails
      ),
    });

    // Send confirmation to mentor
    await sendEmail({
      to: session.mentorId.email,
      subject: "New Session Booking",
      html: createSessionConfirmationEmailHtml(
        session.mentorId.name,
        sessionDetails
      ),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending session confirmation emails:", error);
    return { success: false, error };
  }
}

export async function sendSessionReminderEmails(sessionId: string) {
  try {
    await connectDB();

    // Get session details with populated user information
    const session: any = await Session.findById(sessionId)
      .populate("mentorId", "name email")
      .populate("menteeId", "name email");

    if (!session) {
      throw new Error("Session not found");
    }

    const sessionDate = format(new Date(session.date), "EEEE, MMMM d, yyyy");
    const sessionTime = `${session.startTime} - ${session.endTime}`;
    const duration = `${session.duration} minutes`;

    const sessionDetails = {
      date: sessionDate,
      time: sessionTime,
      duration,
      mentorName: session.mentorId.name,
      topic: session.meeting_type,
      meetingLink: session.meetingLink, // If you have meeting links
    };

    // Send reminder to mentee
    await sendEmail({
      to: session.menteeId.email,
      subject: "Session Reminder",
      html: createSessionReminderEmailHtml(
        session.menteeId.name,
        sessionDetails
      ),
    });

    // Send reminder to mentor
    await sendEmail({
      to: session.mentorId.email,
      subject: "Session Reminder",
      html: createSessionReminderEmailHtml(
        session.mentorId.name,
        sessionDetails
      ),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending session reminder emails:", error);
    return { success: false, error };
  }
}
