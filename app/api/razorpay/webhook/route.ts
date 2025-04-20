import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import Session from "@/models/Session";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Razorpay webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Get the Razorpay signature from headers
    const razorpaySignature = req.headers.get("x-razorpay-signature");
    if (!razorpaySignature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Process the webhook based on event type
    const { event, payload } = body;

    await connectDB();

    if (event === "payment.authorized" || event === "payment.captured") {
      const { payment } = payload;
      const { entity } = payment;

      const razorpayPaymentId = entity.id;
      const razorpayOrderId = entity.order_id;

      // Find the payment by transaction ID
      const paymentRecord = await Payment.findOne({
        transactionId: razorpayPaymentId,
      });

      if (paymentRecord) {
        // Payment already processed
        return NextResponse.json({ success: true });
      }

      // Extract receipt (sessionId) from notes or description
      const receipt = entity.notes?.receipt || entity.receipt;
      if (!receipt) {
        console.error("Receipt (sessionId) not found in payment data");
        return NextResponse.json(
          { error: "Session ID not found" },
          { status: 400 }
        );
      }

      // Find the session
      const sessionRecord = await Session.findById(receipt);
      if (!sessionRecord) {
        console.error(`Session not found for id: ${receipt}`);
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }

      // Update or create payment record
      const status = event === "payment.captured" ? "completed" : "pending";

      if (!paymentRecord) {
        // Create new payment record
        const newPayment = new Payment({
          sessionId: sessionRecord._id,
          userId: sessionRecord.menteeId,
          recipientId: sessionRecord.mentorId,
          amount: entity.amount / 100, // Convert from paise to rupees
          currency: entity.currency,
          paymentMethod: "razorpay",
          status,
          transactionId: razorpayPaymentId,
          paymentDate: new Date(),
        });

        await newPayment.save();

        // Update session status
        sessionRecord.status = "confirmed";
        await sessionRecord.save();

        // Revalidate relevant pages
        revalidatePath(`/dashboard/mentee/sessions/${receipt}`);
        revalidatePath(`/payment/success/${receipt}`);
        revalidatePath(`/profile`);
      } else {
        // Update existing payment
        paymentRecord.status = status;
        await paymentRecord.save();
      }
    } else if (event === "payment.failed") {
      const { payment } = payload;
      const { entity } = payment;

      // Handle failed payment
      console.log(`Payment failed for order ${entity.order_id}`);

      // Find the payment by transaction ID and update status
      const paymentRecord = await Payment.findOne({ transactionId: entity.id });
      if (paymentRecord) {
        paymentRecord.status = "failed";
        await paymentRecord.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// HEAD request for webhook verification
export async function HEAD() {
  return NextResponse.json({ success: true });
}
