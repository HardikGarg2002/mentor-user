"use server";

import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Chat from "@/models/chat";
import Payment from "@/models/Payment";
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import { SessionStatus } from "@/types/session";
import { PaymentStatus } from "@/types/payment";

/**
 * Fetch upcoming sessions for a mentee
 * @param menteeId - The ID of the mentee
 */
export async function getUpcomingSessions(menteeId: string) {
  try {
    await connectDB();

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const currentTime = now.toTimeString().slice(0, 5);

    // Find all upcoming and ongoing sessions for this mentee
    const sessions = await Session.find({
      menteeId,
      $or: [
        // Future dates (tomorrow onwards)
        { date: { $gte: tomorrow } },
        // Today's sessions that haven't ended yet
        {
          date: { $gte: today, $lt: tomorrow },
          endTime: { $gt: currentTime },
        },
      ],
      status: { $in: [SessionStatus.CONFIRMED, SessionStatus.RESERVED] },
    }).sort({ date: 1, startTime: 1 });

    // Get mentor information for each session
    const mentorIds = sessions.map((session) => session.mentorId);
    const users = await User.find({ _id: { $in: mentorIds } });
    const mentorProfiles = await Mentor.find({ userId: { $in: mentorIds } });

    return sessions.map((session) => {
      const user = users.find(
        (u) => u._id.toString() === session.mentorId.toString()
      );
      const mentorProfile = mentorProfiles.find(
        (mp) => mp.userId.toString() === session.mentorId.toString()
      );

      // Check if the session is ongoing (happening right now)
      const sessionDate = new Date(session.date);
      const isToday =
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear();

      const isOngoing =
        isToday &&
        session.startTime <= currentTime &&
        session.endTime > currentTime;

      // Check accessibility for different features
      const chatAccessible = isSessionAccessible(
        session.date,
        session.startTime,
        session.meeting_type,
        "chat"
      );
      const videoAccessible = isSessionAccessible(
        session.date,
        session.startTime,
        session.meeting_type,
        "video"
      );

      return {
        id: session._id.toString(),
        mentorId: session.mentorId.toString(),
        mentorName: user?.name || "Unknown",
        mentorImage: user?.image || "",
        mentorTitle: mentorProfile?.title || "",
        type: session.meeting_type,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        status: session.status,
        price: session.price,
        isOngoing: isOngoing,
        chatAccessible: chatAccessible,
        videoAccessible: videoAccessible,
      };
    });
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    return [];
  }
}

/**
 * Fetch past sessions for a mentee
 * @param menteeId - The ID of the mentee
 */
export async function getPastSessions(menteeId: string) {
  try {
    await connectDB();

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const currentTime = now.toTimeString().slice(0, 5);

    // Find all past sessions for this mentee
    const sessions = await Session.find({
      menteeId,
      $or: [
        // Past dates
        { date: { $lt: today } },
        // Today's sessions that have ended
        {
          date: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
          endTime: { $lt: currentTime },
        },
      ],
      status: { $in: [SessionStatus.COMPLETED, SessionStatus.CONFIRMED] },
    }).sort({ date: -1, startTime: -1 });

    // Get mentor information for each session
    const mentorIds = sessions.map((session) => session.mentorId);
    const users = await User.find({ _id: { $in: mentorIds } });
    const mentorProfiles = await Mentor.find({ userId: { $in: mentorIds } });

    return sessions.map((session) => {
      const user = users.find(
        (u) => u._id.toString() === session.mentorId.toString()
      );
      const mentorProfile = mentorProfiles.find(
        (mp) => mp.userId.toString() === session.mentorId.toString()
      );

      return {
        id: session._id.toString(),
        mentorId: session.mentorId.toString(),
        mentorName: user?.name || "Unknown",
        mentorImage: user?.image || "",
        mentorTitle: mentorProfile?.title || "",
        type: session.meeting_type,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        status: session.status,
        price: session.price,
        rating: session.rating,
        review: session.review,
        // If the session has a rating or review, it's been rated
        rated: !!(session.rating || session.review),
      };
    });
  } catch (error) {
    console.error("Error fetching past sessions:", error);
    return [];
  }
}

/**
 * Fetch chat history for a mentee
 * @param menteeId - The ID of the mentee
 */
export async function getChatHistory(menteeId: string) {
  try {
    await connectDB();

    // Find all chats for this mentee
    const chats = await Chat.find({ menteeId }).sort({ lastUpdated: -1 });

    // Get mentor information for each chat
    const mentorIds = chats.map((chat) => chat.mentorId);
    const users = await User.find({ _id: { $in: mentorIds } });
    const mentorProfiles = await Mentor.find({ userId: { $in: mentorIds } });

    return chats.map((chat) => {
      const user = users.find(
        (u) => u._id.toString() === chat.mentorId.toString()
      );
      const mentorProfile = mentorProfiles.find(
        (mp) => mp.userId.toString() === chat.mentorId.toString()
      );
      const lastMessage =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null;

      return {
        id: chat._id.toString(),
        mentorId: chat.mentorId.toString(),
        mentorName: user?.name || "Unknown",
        mentorImage: user?.image || "",
        mentorTitle: mentorProfile?.title || "",
        lastMessage: lastMessage?.content || "",
        timestamp: lastMessage?.timestamp || chat.lastUpdated,
        unread: chat.messages.some(
          (m) => m.read === false && m.sender.toString() !== menteeId
        ),
      };
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

/**
 * Fetch payments made by a mentee
 * @param menteeId - The ID of the mentee
 */
export async function getPaymentHistory(menteeId: string) {
  try {
    await connectDB();

    // Get all payments made by this mentee
    const payments = await Payment.find({
      userId: menteeId,
    }).sort({ createdAt: -1 });

    // Get session information for each payment
    const sessionIds = payments.map((payment) => payment.sessionId);
    const sessions = await Session.find({ _id: { $in: sessionIds } });

    // Get mentor information
    const mentorIds = sessions.map((session) => session.mentorId);
    const users = await User.find({ _id: { $in: mentorIds } });

    return payments.map((payment) => {
      const session = sessions.find(
        (s) => s._id.toString() === payment.sessionId.toString()
      );
      const mentor = users.find(
        (u) => session && u._id.toString() === session.mentorId.toString()
      );

      return {
        id: payment._id.toString(),
        sessionId: payment.sessionId.toString(),
        mentorName: mentor?.name || "Unknown",
        mentorImage: mentor?.image || "",
        amount: payment.amount,
        currency: payment.currency,
        date: payment.createdAt,
        status: payment.status,
        sessionType: session?.meeting_type || "",
        sessionDate: session?.date || "",
        paymentMethod: payment.paymentMethod,
      };
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
}

/**
 * Fetch notifications for a mentee
 * @param menteeId - The ID of the mentee
 */
export async function getNotifications(menteeId: string) {
  try {
    await connectDB();

    const notifications = [];
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Get recent session confirmations
    const recentConfirmations = await Session.find({
      menteeId,
      updatedAt: { $gte: twoWeeksAgo },
      status: SessionStatus.CONFIRMED,
    }).sort({ updatedAt: -1 });

    // Get mentor information
    const mentorIds = recentConfirmations.map((session) => session.mentorId);
    const mentors = await User.find({ _id: { $in: mentorIds } });

    // Add confirmation notifications
    for (const session of recentConfirmations) {
      const mentor = mentors.find(
        (m) => m._id.toString() === session.mentorId.toString()
      );
      notifications.push({
        id: `confirm_${session._id.toString()}`,
        type: "confirmation",
        message: `Session with ${mentor?.name || "Unknown"} has been confirmed`,
        timestamp: session.updatedAt,
        read: false,
        sessionId: session._id.toString(),
      });
    }

    // Get recent payments
    const recentPayments = await Payment.find({
      userId: menteeId,
      createdAt: { $gte: twoWeeksAgo },
    }).sort({ createdAt: -1 });

    // Add payment notifications
    for (const payment of recentPayments) {
      notifications.push({
        id: `payment_${payment._id.toString()}`,
        type: "payment",
        message: `Payment of $${
          payment.amount
        } has been ${payment.status.toLowerCase()}`,
        timestamp: payment.createdAt,
        read: false,
        paymentId: payment._id.toString(),
      });
    }

    // Get upcoming sessions (reminder)
    const upcomingSessions = await Session.find({
      menteeId,
      date: { $gte: today },
      status: SessionStatus.CONFIRMED,
    }).sort({ date: 1, startTime: 1 });

    // Add session reminders (24 hours before)
    for (const session of upcomingSessions) {
      // Convert session date string to Date object for time comparison
      const sessionDateTime = new Date(session.date);
      const sessionHours = parseInt(session.startTime.split(":")[0], 10);
      const sessionMinutes = parseInt(session.startTime.split(":")[1], 10);
      sessionDateTime.setHours(sessionHours, sessionMinutes, 0, 0);

      const timeUntilSession = sessionDateTime.getTime() - now.getTime();
      const hoursUntilSession = timeUntilSession / (1000 * 60 * 60);

      // Only add reminders for sessions that are happening within 24 hours
      if (hoursUntilSession <= 24) {
        const mentor = mentors.find(
          (m) => m._id.toString() === session.mentorId.toString()
        );
        notifications.push({
          id: `reminder_${session._id.toString()}`,
          type: "reminder",
          message: `Upcoming session with ${
            mentor?.name || "Unknown"
          } in ${Math.floor(hoursUntilSession)} hours`,
          timestamp: now,
          read: false,
          sessionId: session._id.toString(),
        });
      }
    }

    // Sort all notifications by timestamp
    return notifications.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

/**
 * Get recommended mentors for a mentee
 * @param menteeId - The ID of the mentee
 */
export async function getRecommendedMentors(menteeId: string) {
  try {
    await connectDB();

    // This is a simplified recommendation algorithm
    // In a real app, you would use user preferences, past sessions, and other factors

    // Get all mentors sorted by rating
    const mentorProfiles = await Mentor.find()
      .sort({ rating: -1, reviewCount: -1 })
      .limit(6);

    // Get user information for mentors
    const userIds = mentorProfiles.map((mentor) => mentor.userId);
    const users = await User.find({ _id: { $in: userIds } });

    return mentorProfiles.map((profile) => {
      const user = users.find(
        (u) => u._id.toString() === profile.userId.toString()
      );

      return {
        id: profile._id.toString(),
        userId: profile.userId.toString(),
        name: user?.name || "Unknown",
        image: user?.image || "",
        title: profile.title,
        rating: profile.rating,
        specialties: profile.specialties,
        pricing: profile.pricing,
      };
    });
  } catch (error) {
    console.error("Error fetching recommended mentors:", error);
    return [];
  }
}

/**
 * Get mentee dashboard statistics
 * @param menteeId - The ID of the mentee
 */
export async function getMenteeStats(menteeId: string) {
  try {
    await connectDB();

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const currentTime = now.toTimeString().slice(0, 5);

    // Count completed sessions
    const completedSessionsCount = await Session.countDocuments({
      menteeId,
      status: SessionStatus.COMPLETED,
    });

    // Count upcoming sessions (including ongoing)
    const upcomingSessionsCount = await Session.countDocuments({
      menteeId,
      $or: [
        { date: { $gte: tomorrow } },
        {
          date: { $gte: today, $lt: tomorrow },
          endTime: { $gt: currentTime },
        },
      ],
      status: { $in: [SessionStatus.CONFIRMED, SessionStatus.RESERVED] },
    });

    // Calculate total spent on sessions
    const payments = await Payment.find({
      userId: menteeId,
      status: PaymentStatus.COMPLETED,
    });

    const totalSpent = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Count total unique mentors
    const sessionsWithMentors = await Session.find({
      menteeId,
      status: { $in: [SessionStatus.COMPLETED, SessionStatus.CONFIRMED] },
    });

    const uniqueMentorIds = new Set(
      sessionsWithMentors.map((session) => session.mentorId.toString())
    );
    const uniqueMentorsCount = uniqueMentorIds.size;

    return {
      completed: completedSessionsCount,
      upcoming: upcomingSessionsCount,
      totalSpent,
      uniqueMentors: uniqueMentorsCount,
    };
  } catch (error) {
    console.error("Error fetching mentee stats:", error);
    return {
      completed: 0,
      upcoming: 0,
      totalSpent: 0,
      uniqueMentors: 0,
    };
  }
}

/**
 * Fetch only ongoing sessions for a mentee
 * @param menteeId - The ID of the mentee
 */
export async function getOngoingSessions(menteeId: string) {
  try {
    await connectDB();

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const currentTime = now.toTimeString().slice(0, 5);

    // Find only sessions happening right now
    const sessions = await Session.find({
      menteeId,
      date: { $gte: today, $lt: tomorrow },
      startTime: { $lte: currentTime },
      endTime: { $gt: currentTime },
      status: { $in: [SessionStatus.CONFIRMED, SessionStatus.RESERVED] },
    });

    // Get mentor information for each session
    const mentorIds = sessions.map((session) => session.mentorId);
    const users = await User.find({ _id: { $in: mentorIds } });
    const mentorProfiles = await Mentor.find({ userId: { $in: mentorIds } });

    return sessions.map((session) => {
      const user = users.find(
        (u) => u._id.toString() === session.mentorId.toString()
      );
      const mentorProfile = mentorProfiles.find(
        (mp) => mp.userId.toString() === session.mentorId.toString()
      );

      // Check accessibility for different features
      const chatAccessible = isSessionAccessible(
        session.date,
        session.startTime,
        session.meeting_type,
        "chat"
      );
      const videoAccessible = isSessionAccessible(
        session.date,
        session.startTime,
        session.meeting_type,
        "video"
      );

      return {
        id: session._id.toString(),
        mentorId: session.mentorId.toString(),
        mentorName: user?.name || "Unknown",
        mentorImage: user?.image || "",
        mentorTitle: mentorProfile?.title || "",
        type: session.meeting_type,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        status: session.status,
        price: session.price,
        isOngoing: true,
        chatAccessible: chatAccessible,
        videoAccessible: videoAccessible,
      };
    });
  } catch (error) {
    console.error("Error fetching ongoing sessions:", error);
    return [];
  }
}

/**
 * Check if a session is accessible for video/chat
 * - For chat sessions: always accessible
 * - For video/call sessions: accessible 10 minutes before start time until 10 minutes after
 * @param sessionDate - Date of the session
 * @param startTime - Start time of the session (HH:MM format)
 * @param sessionType - Type of session (chat, video, call)
 * @param feature - Feature trying to access (chat or video)
 */
function isSessionAccessible(
  sessionDate: Date,
  startTime: string,
  sessionType: string,
  feature: "chat" | "video" = "video"
): boolean {
  // Chat is always accessible for chat sessions
  if (feature === "chat") {
    return true;
  }

  // For video features, check time window
  if (
    feature === "video" &&
    (sessionType === "video" || sessionType === "call")
  ) {
    const now = new Date();
    const sessionDateTime = new Date(sessionDate);

    // Set the session time on the session date
    const [hours, minutes] = startTime.split(":").map(Number);
    sessionDateTime.setHours(hours, minutes, 0, 0);

    // Calculate time difference in minutes
    const diffMs = sessionDateTime.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    // Access is allowed from 10 minutes before to 10 minutes after session start
    return diffMinutes >= -10 && diffMinutes <= 10;
  }

  return false;
}

/**
 * Fetch upcoming sessions for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getMentorUpcomingSessions(mentorId: string) {
  try {
    await connectDB();

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const currentTime = now.toTimeString().slice(0, 5);

    // Find all upcoming and ongoing sessions for this mentor
    const sessions = await Session.find({
      mentorId,
      $or: [
        // Future dates (tomorrow onwards)
        { date: { $gte: tomorrow } },
        // Today's sessions that haven't ended yet
        {
          date: { $gte: today, $lt: tomorrow },
          endTime: { $gt: currentTime },
        },
      ],
      status: { $in: [SessionStatus.CONFIRMED, SessionStatus.RESERVED] },
    }).sort({ date: 1, startTime: 1 });

    // Get mentee information for each session
    const menteeIds = sessions.map((session) => session.menteeId);
    const users = await User.find({ _id: { $in: menteeIds } });

    return sessions.map((session) => {
      const user = users.find(
        (u) => u._id.toString() === session.menteeId.toString()
      );

      // Check if the session is ongoing (happening right now)
      const sessionDate = new Date(session.date);
      const isToday =
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear();

      const isOngoing =
        isToday &&
        session.startTime <= currentTime &&
        session.endTime > currentTime;

      // Check accessibility for different features
      const chatAccessible = isSessionAccessible(
        session.date,
        session.startTime,
        session.meeting_type,
        "chat"
      );
      const videoAccessible = isSessionAccessible(
        session.date,
        session.startTime,
        session.meeting_type,
        "video"
      );

      return {
        id: session._id.toString(),
        menteeId: session.menteeId.toString(),
        menteeName: user?.name || "Unknown",
        menteeImage: user?.image || "",
        type: session.meeting_type,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        status: session.status,
        price: session.price,
        isOngoing: isOngoing,
        chatAccessible: chatAccessible,
        videoAccessible: videoAccessible,
      };
    });
  } catch (error) {
    console.error("Error fetching mentor upcoming sessions:", error);
    return [];
  }
}

/**
 * Fetch only ongoing sessions for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getMentorOngoingSessions(mentorId: string) {
  try {
    await connectDB();

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const currentTime = now.toTimeString().slice(0, 5);

    // Find only sessions happening right now
    const sessions = await Session.find({
      mentorId,
      date: { $gte: today, $lt: tomorrow },
      startTime: { $lte: currentTime },
      endTime: { $gt: currentTime },
      status: { $in: [SessionStatus.CONFIRMED, SessionStatus.RESERVED] },
    });

    // Get mentee information for each session
    const menteeIds = sessions.map((session) => session.menteeId);
    const users = await User.find({ _id: { $in: menteeIds } });

    return sessions.map((session) => {
      const user = users.find(
        (u) => u._id.toString() === session.menteeId.toString()
      );

      // Check accessibility for different features
      const chatAccessible = isSessionAccessible(
        session.date,
        session.startTime,
        session.meeting_type,
        "chat"
      );
      const videoAccessible = isSessionAccessible(
        session.date,
        session.startTime,
        session.meeting_type,
        "video"
      );

      return {
        id: session._id.toString(),
        menteeId: session.menteeId.toString(),
        menteeName: user?.name || "Unknown",
        menteeImage: user?.image || "",
        type: session.meeting_type,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        status: session.status,
        price: session.price,
        isOngoing: true,
        chatAccessible: chatAccessible,
        videoAccessible: videoAccessible,
      };
    });
  } catch (error) {
    console.error("Error fetching mentor ongoing sessions:", error);
    return [];
  }
}

/**
 * Get details for a specific session
 * @param sessionId - The ID of the session
 */
export async function getSessionById(sessionId: string) {
  try {
    await connectDB();

    const session = await Session.findById(sessionId);
    if (!session) {
      return null;
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const currentTime = now.toTimeString().slice(0, 5);

    // Get mentor and mentee information
    const mentor = await User.findById(session.mentorId);
    const mentee = await User.findById(session.menteeId);
    const mentorProfile = await Mentor.findOne({ userId: session.mentorId });

    // Check if the session is ongoing
    const sessionDate = new Date(session.date);
    const isToday =
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear();

    const isOngoing =
      isToday &&
      session.startTime <= currentTime &&
      session.endTime > currentTime;

    // Check accessibility for different features
    const chatAccessible = isSessionAccessible(
      session.date,
      session.startTime,
      session.meeting_type,
      "chat"
    );
    const videoAccessible = isSessionAccessible(
      session.date,
      session.startTime,
      session.meeting_type,
      "video"
    );

    return {
      id: session._id.toString(),
      mentorId: session.mentorId.toString(),
      menteeId: session.menteeId.toString(),
      mentorName: mentor?.name || "Unknown",
      mentorImage: mentor?.image || "",
      mentorTitle: mentorProfile?.title || "",
      menteeName: mentee?.name || "Unknown",
      menteeImage: mentee?.image || "",
      type: session.meeting_type,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      status: session.status,
      price: session.price,
      isOngoing: isOngoing,
      chatAccessible: chatAccessible,
      videoAccessible: videoAccessible,
    };
  } catch (error) {
    console.error("Error fetching session details:", error);
    return null;
  }
}
