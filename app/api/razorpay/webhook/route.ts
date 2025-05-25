import { NextRequest, NextResponse } from "next/server";
import Payment from "@/models/Payment";
import Session from "@/models/Session";
import { revalidatePath } from "next/cache";
import { SessionStatus } from "@/types/session";
import { PaymentStatus } from "@/types/payment";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import { sendSessionConfirmationEmails } from "@/lib/session-emails";
import { sendPushNotification } from "@/lib/utils/send-push";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = await verifyRazorpayWebhook(payload, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = payload.event;

    if (event === "payment.authorized" || event === "payment.captured") {
      const { payment } = payload;
      const { entity } = payment;

      const razorpayPaymentId = entity.id;

      // Find the payment by transaction ID
      const paymentRecord = await Payment.findOne({
        transactionId: razorpayPaymentId,
      });

      if (paymentRecord) {
        // Payment already processed
        console.log(`Payment ${razorpayPaymentId} already processed, skipping`);
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
      const status =
        event === "payment.captured"
          ? PaymentStatus.COMPLETED
          : PaymentStatus.PENDING;

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
        console.log(`Created new payment record for session ${receipt}`);

        // Only update session status to confirmed when payment is captured
        if (event === "payment.captured") {
          sessionRecord.status = SessionStatus.CONFIRMED;
          sessionRecord.reservationExpires = undefined; // Clear reservation expiry
          await sessionRecord.save();
          console.log(`Updated session ${receipt} status to CONFIRMED`);

          // Send confirmation emails
          try {
            await sendSessionConfirmationEmails(receipt);
            console.log(`Sent confirmation emails for session ${receipt}`);
            // Send push notification
            await sendPushNotification({
              title: "Session Booked!",
              body: "Your session has been booked and confirmed.",
              url: `/sessions/${receipt}`,
            });
            console.log("Push notification sent for session booking");
          } catch (emailError) {
            console.error(
              "Error sending confirmation emails or push notification:",
              emailError
            );
            // Don't fail the webhook if email or push fails
          }
        }

        // Revalidate relevant pages
        revalidatePath(`/sessions/${receipt}`);
        revalidatePath(`/payment/success/${receipt}`);
        revalidatePath(`/profile`);
        revalidatePath("/dashboard/mentee");
        revalidatePath("/dashboard/mentor");
      } else {
        // Update existing payment
        paymentRecord.status = status;
        await paymentRecord.save();
        console.log(`Updated payment ${razorpayPaymentId} status to ${status}`);

        // Update session status if payment is now captured
        if (
          event === "payment.captured" &&
          sessionRecord.status === SessionStatus.RESERVED
        ) {
          sessionRecord.status = SessionStatus.CONFIRMED;
          sessionRecord.reservationExpires = undefined; // Clear reservation expiry
          await sessionRecord.save();
          console.log(`Updated session ${receipt} status to CONFIRMED`);

          // Send confirmation emails
          try {
            await sendSessionConfirmationEmails(receipt);
            console.log(`Sent confirmation emails for session ${receipt}`);
            // Send push notification
            await sendPushNotification({
              title: "Session Booked!",
              body: "Your session has been booked and confirmed.",
              url: `/sessions/${receipt}`,
            });
            console.log("Push notification sent for session booking");
          } catch (emailError) {
            console.error(
              "Error sending confirmation emails or push notification:",
              emailError
            );
            // Don't fail the webhook if email or push fails
          }

          // Revalidate relevant pages
          revalidatePath(`/sessions/${receipt}`);
          revalidatePath(`/payment/success/${receipt}`);
          revalidatePath(`/profile`);
          revalidatePath("/dashboard/mentee");
          revalidatePath("/dashboard/mentor");
        }
      }
    } else if (event === "payment.failed") {
      const { payment } = payload;
      const { entity } = payment;

      // Handle failed payment
      console.log(`Payment failed for order ${entity.order_id}`);

      // Find the payment by transaction ID and update status
      const paymentRecord = await Payment.findOne({ transactionId: entity.id });
      if (paymentRecord) {
        paymentRecord.status = PaymentStatus.FAILED;
        await paymentRecord.save();
        console.log(`Updated payment ${entity.id} status to FAILED`);
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
