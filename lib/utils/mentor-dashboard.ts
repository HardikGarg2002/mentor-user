"use server";

import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Chat from "@/models/chat";
import Payment from "@/models/Payment";
import User from "@/models/User";
import { SessionStatus } from "@/types/session";
import { PaymentStatus } from "@/types/payment";

/**
 * Fetch upcoming sessions for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getUpcomingSessions(mentorId: string) {
  try {
    await connectDB();

    const now = new Date();

    // Find all upcoming sessions for this mentor
    const sessions = await Session.find({
      mentorId,
      date: { $gte: now },
      status: { $in: [SessionStatus.CONFIRMED] },
    }).sort({ date: 1, startTime: 1 });

    // Get mentee information for each session
    const menteeIds = sessions.map((session) => session.menteeId);
    const mentees = await User.find({ _id: { $in: menteeIds } });

    return sessions.map((session) => {
      const mentee = mentees.find(
        (m) => m._id.toString() === session.menteeId.toString()
      );

      return {
        id: session._id.toString(),
        menteeId: session.menteeId.toString(),
        menteeName: mentee?.name || "Unknown",
        menteeImage: mentee?.image || "",
        type: session.meeting_type,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        status: session.status,
        price: session.price,
      };
    });
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    return [];
  }
}

/**
 * Fetch previous sessions for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getPreviousSessions(mentorId: string) {
  try {
    await connectDB();

    const now = new Date();

    // Find all previous sessions for this mentor
    const sessions = await Session.find({
      mentorId,
      $or: [
        { date: { $lt: now } },
        {
          $and: [
            { date: { $eq: now.toISOString().split("T")[0] } },
            { endTime: { $lt: now.toTimeString().slice(0, 5) } },
          ],
        },
      ],
      status: { $in: [SessionStatus.COMPLETED, SessionStatus.CONFIRMED] },
    }).sort({ date: -1, startTime: -1 });

    // Get mentee information for each session
    const menteeIds = sessions.map((session) => session.menteeId);
    const mentees = await User.find({ _id: { $in: menteeIds } });

    return sessions.map((session) => {
      const mentee = mentees.find(
        (m) => m._id.toString() === session.menteeId.toString()
      );

      return {
        id: session._id.toString(),
        menteeId: session.menteeId.toString(),
        menteeName: mentee?.name || "Unknown",
        menteeImage: mentee?.image || "",
        type: session.meeting_type,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        status: session.status,
        price: session.price,
        rating: session.rating,
        review: session.review,
      };
    });
  } catch (error) {
    console.error("Error fetching previous sessions:", error);
    return [];
  }
}

/**
 * Fetch chat history for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getChatHistory(mentorId: string) {
  try {
    await connectDB();

    // Find all chats for this mentor
    const chats = await Chat.find({ mentorId }).sort({ lastUpdated: -1 });

    // Get mentee information for each chat
    const menteeIds = chats.map((chat) => chat.menteeId);
    const mentees = await User.find({ _id: { $in: menteeIds } });

    return chats.map((chat) => {
      const mentee = mentees.find(
        (m) => m._id.toString() === chat.menteeId.toString()
      );
      const lastMessage =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null;

      return {
        id: chat._id.toString(),
        menteeId: chat.menteeId.toString(),
        menteeName: mentee?.name || "Unknown",
        menteeImage: mentee?.image || "",
        lastMessage: lastMessage?.content || "",
        timestamp: lastMessage?.timestamp || chat.lastUpdated,
        unread: chat.messages.some(
          (m) => m.read === false && m.sender.toString() !== mentorId
        ),
      };
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

/**
 * Fetch earnings data for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getEarningsData(mentorId: string) {
  try {
    await connectDB();

    // Get all completed payments for this mentor
    const payments = await Payment.find({
      recipientId: mentorId,
      status: PaymentStatus.COMPLETED,
    });

    // Calculate total earnings
    const totalEarnings = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Calculate earnings for the current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const earningsThisMonth = payments
      .filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Calculate pending earnings
    const pendingPayments = await Payment.find({
      recipientId: mentorId,
      status: PaymentStatus.PENDING,
    });

    const pendingEarnings = pendingPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Get future sessions that will generate income
    const upcomingSessions = await Session.find({
      mentorId,
      date: { $gte: now },
      status: SessionStatus.CONFIRMED,
      paymentId: { $exists: true },
    });

    const upcomingSessionsCount = upcomingSessions.length;

    // Estimate the next payout date (typically first of next month)
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const payoutDate = nextMonth.toISOString().split("T")[0];

    return {
      total: totalEarnings,
      thisMonth: earningsThisMonth,
      pending: pendingEarnings,
      nextPayout: pendingEarnings,
      payoutDate,
      upcomingSessionsCount,
    };
  } catch (error) {
    console.error("Error fetching earnings data:", error);
    return {
      total: 0,
      thisMonth: 0,
      pending: 0,
      nextPayout: 0,
      payoutDate: "",
      upcomingSessionsCount: 0,
    };
  }
}

/**
 * Fetch payment history for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getPaymentHistory(mentorId: string) {
  try {
    await connectDB();

    // Get all completed payments for this mentor
    const payments = await Payment.find({
      recipientId: mentorId,
      status: PaymentStatus.COMPLETED,
    }).sort({ paymentDate: -1 });

    // Group payments by month
    const groupedPayments = payments.reduce((result, payment) => {
      const paymentDate = new Date(payment.paymentDate);
      const month = paymentDate.getMonth();
      const year = paymentDate.getFullYear();
      const key = `${year}-${month}`;

      if (!result[key]) {
        result[key] = {
          id: key,
          date: `${new Date(year, month).toLocaleString("default", {
            month: "long",
          })} ${year}`,
          amount: 0,
          sessions: 0,
        };
      }

      result[key].amount += payment.amount;
      result[key].sessions += 1;

      return result;
    }, {} as Record<string, any>);

    return Object.values(groupedPayments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
}

/**
 * Fetch notifications for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getNotifications(mentorId: string) {
  try {
    await connectDB();

    const notifications = [];
    const now = new Date();
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Get recent session bookings
    const recentBookings = await Session.find({
      mentorId,
      createdAt: { $gte: twoWeeksAgo },
      status: { $in: [SessionStatus.CONFIRMED, SessionStatus.CONFIRMED] },
    }).sort({ createdAt: -1 });

    // Get mentee information for bookings
    const menteeIds = recentBookings.map((session) => session.menteeId);
    const mentees = await User.find({ _id: { $in: menteeIds } });

    // Add booking notifications
    for (const booking of recentBookings) {
      const mentee = mentees.find(
        (m) => m._id.toString() === booking.menteeId.toString()
      );
      notifications.push({
        id: `booking_${booking._id.toString()}`,
        type: "booking",
        message: `New session booked with ${mentee?.name || "Unknown"}`,
        timestamp: booking.createdAt,
        read: false,
      });
    }

    // Get recent reviews
    const recentReviews = await Session.find({
      mentorId,
      rating: { $exists: true },
      review: { $exists: true },
      updatedAt: { $gte: twoWeeksAgo },
    }).sort({ updatedAt: -1 });

    // Add review notifications
    for (const review of recentReviews) {
      const mentee = mentees.find(
        (m) => m._id.toString() === review.menteeId.toString()
      );
      notifications.push({
        id: `review_${review._id.toString()}`,
        type: "review",
        message: `${mentee?.name || "Unknown"} left a ${
          review.rating
        }-star review`,
        timestamp: review.updatedAt,
        read: false,
      });
    }

    // Get recent payments
    const recentPayments = await Payment.find({
      recipientId: mentorId,
      status: PaymentStatus.COMPLETED,
      updatedAt: { $gte: twoWeeksAgo },
    }).sort({ updatedAt: -1 });

    // Add payment notifications
    for (const payment of recentPayments) {
      notifications.push({
        id: `payment_${payment._id.toString()}`,
        type: "system",
        message: `Your payout of $${payment.amount} has been processed`,
        timestamp: payment.updatedAt,
        read: false,
      });
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
 * Fetch reviews for a mentor
 * @param mentorId - The ID of the mentor
 */
export async function getReviews(mentorId: string) {
  try {
    await connectDB();

    // Get all sessions with reviews
    const reviewedSessions = await Session.find({
      mentorId,
      rating: { $exists: true },
      review: { $ne: "" },
    }).sort({ updatedAt: -1 });

    // Get mentee information
    const menteeIds = reviewedSessions.map((session) => session.menteeId);
    const mentees = await User.find({ _id: { $in: menteeIds } });

    return reviewedSessions.map((session) => {
      const mentee = mentees.find(
        (m) => m._id.toString() === session.menteeId.toString()
      );

      return {
        id: session._id.toString(),
        menteeId: session.menteeId.toString(),
        menteeName: mentee?.name || "Unknown",
        menteeImage: mentee?.image || "",
        rating: session.rating || 0,
        review: session.review || "",
        date: session.updatedAt,
      };
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

/**
 * Get mentor dashboard statistics
 * @param mentorId - The ID of the mentor
 */
export async function getMentorStats(mentorId: string) {
  try {
    await connectDB();

    const now = new Date();

    // Count completed sessions
    const completedSessionsCount = await Session.countDocuments({
      mentorId,
      status: SessionStatus.COMPLETED,
    });

    // Count upcoming sessions
    const upcomingSessionsCount = await Session.countDocuments({
      mentorId,
      date: { $gte: now },
      status: { $in: [SessionStatus.CONFIRMED, SessionStatus.CONFIRMED] },
    });

    // Count cancelled sessions
    const cancelledSessionsCount = await Session.countDocuments({
      mentorId,
      status: SessionStatus.CANCELLED,
    });

    return {
      completed: completedSessionsCount,
      upcoming: upcomingSessionsCount,
      cancelled: cancelledSessionsCount,
    };
  } catch (error) {
    console.error("Error fetching mentor stats:", error);
    return {
      completed: 0,
      upcoming: 0,
      cancelled: 0,
    };
  }
}
