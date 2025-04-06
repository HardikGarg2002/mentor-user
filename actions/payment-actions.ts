"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import Payment from "@/models/Payment";

export async function createPayment(sessionId: string, paymentMethod: string) {
  const session = await auth();
  if (!session || !session.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();

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
      };
    }

    // Check if user is the mentee for this session
    if (!sessionRecord.menteeId.equals(currentUser._id)) {
      return {
        success: false,
        error: "You are not authorized to make a payment for this session",
      };
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      sessionId: sessionRecord._id,
    });
    if (existingPayment) {
      return {
        success: false,
        error: "Payment already exists for this session",
      };
    }

    // Create a new payment
    const payment = new Payment({
      sessionId: sessionRecord._id,
      userId: currentUser._id,
      recipientId: sessionRecord.mentorId,
      amount: sessionRecord.price,
      paymentMethod,
      status: "completed", // In a real app, this would be set after payment processing
      transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`, // Mock transaction ID
      paymentDate: new Date(),
    });

    await payment.save();

    // Update session status to confirmed
    sessionRecord.status = "confirmed";
    await sessionRecord.save();

    revalidatePath(`/dashboard/mentee/sessions/${sessionId}`);
    revalidatePath(`/profile`);

    return {
      success: true,
      paymentId: payment._id.toString(),
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    return {
      success: false,
      error: "Failed to process payment",
    };
  }
}

export async function getPaymentsByUser() {
  const session = await auth();
  if (!session || !session.user) {
    return [];
  }

  try {
    await connectDB();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return [];
    }

    // Find payments where user is either payer or recipient
    const query =
      currentUser.role === "mentor"
        ? { recipientId: currentUser._id }
        : { userId: currentUser._id };

    const payments = (await Payment.find(query)
      .sort({ paymentDate: -1 })
      .populate("sessionId")
      .populate("userId", "name")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .populate("recipientId", "name")) as any;

    return payments.map((payment) => ({
      id: payment._id.toString(),
      sessionId: payment.sessionId._id.toString(),
      userName: payment.userId.name,
      recipientName: payment.recipientId.name,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      transactionId: payment.transactionId,
      paymentDate: payment.paymentDate.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}
