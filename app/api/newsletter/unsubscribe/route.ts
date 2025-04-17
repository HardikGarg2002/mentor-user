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
        { success: false, message: "Invalid or expired unsubscribe link" },
        { status: 400 }
      );
    }

    // Mark as unsubscribed
    subscriber.unsubscribedAt = new Date();
    subscriber.token = undefined; // Clear token after use

    await subscriber.save();

    // Redirect to a confirmation page
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    return NextResponse.redirect(`${baseUrl}/newsletter/unsubscribed`);
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
