"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import Payment from "@/models/Payment";
import { createOrder, verifyPayment } from "@/lib/razorpay";
import mongoose from "mongoose";
import { SessionStatus } from "@/types/session";
import { PaymentStatus } from "@/types/payment";

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
      status: PaymentStatus.COMPLETED, // In a real app, this would be set after payment processing
      transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`, // Mock transaction ID
      paymentDate: new Date(),
    });

    await payment.save();

    // Update session status to confirmed
    sessionRecord.status = SessionStatus.CONFIRMED;
    await sessionRecord.save();

    revalidatePath(`/sessions/${sessionId}`);
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

export async function createRazorpayOrder(sessionId: string) {
  const session = await auth();
  if (!session || !session.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();

    // Run cleanup before processing to ensure clean state
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
      };
    }

    // Check if session is already confirmed
    if (sessionRecord.status === SessionStatus.CONFIRMED) {
      return {
        success: false,
        error: "This session has already been confirmed",
      };
    }

    // Check if session is in RESERVED status
    if (sessionRecord.status !== SessionStatus.RESERVED) {
      return {
        success: false,
        error: "This session is not reserved",
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

    // Create a Razorpay order
    const orderResponse = await createOrder(
      sessionRecord.price,
      "INR",
      sessionId
    );

    if (!orderResponse.success) {
      return {
        success: false,
        error: "Failed to create payment order",
      };
    }

    return {
      success: true,
      order: orderResponse.order,
      amount: sessionRecord.price,
      currency: "INR",
      mentorName:
        (await User.findById(sessionRecord.mentorId))?.name || "Mentor",
      reservationExpires: sessionRecord.reservationExpires?.toISOString(),
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return {
      success: false,
      error: "Failed to create payment order",
    };
  }
}

export async function verifyRazorpayPayment(
  sessionId: string,
  paymentId: string,
  orderId: string,
  signature: string
) {
  const session = await auth();
  if (!session || !session.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await connectDB();

    // Run cleanup before processing to ensure clean state
    const { cleanupExpiredReservations } = await import(
      "@/lib/utils/session-utils"
    );
    await cleanupExpiredReservations();

    // Verify the payment signature
    const verificationResult = await verifyPayment(
      orderId,
      paymentId,
      signature
    );
    if (!verificationResult.success) {
      return {
        success: false,
        error: "Payment verification failed",
      };
    }

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

    // Check if session is in reserved status before proceeding
    if (sessionRecord.status !== SessionStatus.RESERVED) {
      // Session may be already confirmed or in another state
      return {
        success: false,
        error: "Session is not in a valid state for payment",
      };
    }

    // Create a new payment
    const payment = new Payment({
      sessionId: sessionRecord._id,
      userId: currentUser._id,
      recipientId: sessionRecord.mentorId,
      amount: sessionRecord.price,
      currency: "INR",
      paymentMethod: "razorpay",
      status: PaymentStatus.COMPLETED,
      transactionId: paymentId,
      paymentDate: new Date(),
    });

    await payment.save();

    // Update session status to confirmed and clear reservation
    sessionRecord.status = SessionStatus.CONFIRMED;
    sessionRecord.reservationExpires = undefined; // Clear reservation expiry
    await sessionRecord.save();

    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath(`/profile`);

    return {
      success: true,
      paymentId: payment._id.toString(),
    };
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return {
      success: false,
      error: "Failed to verify payment",
    };
  }
}
