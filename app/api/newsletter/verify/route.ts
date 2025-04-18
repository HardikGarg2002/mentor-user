import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import NewsletterSubscriber from "@/models/Newsletter";
import { hashToken } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const email = req.nextUrl.searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        { success: false, message: "Missing token or email" },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash the token for comparison
    const hashedToken = hashToken(token);

    // Find the subscriber with matching email and token
    const subscriber = await NewsletterSubscriber.findOne({
      email,
      token: hashedToken,
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Mark as verified
    subscriber.isVerified = true;
    subscriber.token = undefined; // Clear token after verification

    // If previously unsubscribed, reactivate
    if (subscriber.unsubscribedAt) {
      subscriber.unsubscribedAt = undefined;
    }

    await subscriber.save();

    // Redirect to a thank you page
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    return NextResponse.redirect(`${baseUrl}/newsletter/thank-you`);
  } catch (error) {
    console.error("Newsletter verification error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
