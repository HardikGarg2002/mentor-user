"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";

export async function getUserProfile() {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }

  try {
    await connectDB();

    // Get user data
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return null;
    }

    // Get sessions data
    let sessions = [];
    if (user.role === "mentor") {
      // Get sessions where user is mentor
      const sessionDocs = (await Session.find({ mentorId: user._id })
        .sort({ date: -1 })
        .populate("menteeId", "name")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .limit(10)) as any;

      sessions = sessionDocs.map((session) => ({
        id: session._id.toString(),
        menteeName: session.menteeId.name,
        date: session.date.toISOString(),
        startTime: session.startTime,
        endTime: session.endTime,
        type: session.type,
        price: session.price,
        status: session.status,
      }));
    } else {
      // Get sessions where user is mentee
      const sessionDocs = (await Session.find({ menteeId: user._id })
        .sort({ date: -1 })
        .populate("mentorId", "name")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .limit(10)) as any;

      sessions = sessionDocs.map((session) => ({
        id: session._id.toString(),
        mentorName: session.mentorId.name,
        date: session.date.toISOString(),
        startTime: session.startTime,
        endTime: session.endTime,
        type: session.type,
        price: session.price,
        status: session.status,
      }));
    }

    // Get payments data
    // For now, we'll use session data to simulate payments
    // In a real app, you would fetch from a Payment model
    const payments =
      user.role === "user"
        ? sessions
            .filter((session) => session.status !== "cancelled")
            .map((session) => ({
              id: `payment-${session.id}`,
              mentorName: session.mentorName,
              date: session.date,
              amount: session.price,
              paymentMethod: "Credit Card",
              status: session.status === "completed" ? "completed" : "pending",
            }))
        : [];

    // Get earnings data (for mentors only)
    let earnings = {
      total: 0,
      thisMonth: 0,
      pending: 0,
      history: [],
    };

    if (user.role === "mentor") {
      // Calculate earnings from sessions
      const total = sessions
        .filter((session) => session.status === "completed")
        .reduce((sum, session) => sum + session.price, 0);

      const thisMonth = sessions
        .filter((session) => {
          const sessionDate = new Date(session.date);
          const now = new Date();
          return (
            sessionDate.getMonth() === now.getMonth() &&
            sessionDate.getFullYear() === now.getFullYear() &&
            session.status === "completed"
          );
        })
        .reduce((sum, session) => sum + session.price, 0);

      const pending = sessions
        .filter((session) => session.status === "confirmed")
        .reduce((sum, session) => sum + session.price, 0);

      const history = sessions
        .filter((session) => session.status !== "cancelled")
        .map((session) => ({
          id: session.id,
          menteeName: session.menteeName,
          date: session.date,
          type: session.type,
          amount: session.price,
          status: session.status === "completed" ? "paid" : "pending",
        }));

      earnings = {
        total,
        thisMonth,
        pending,
        history,
      };
    }

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      sessions,
      payments,
      earnings,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
