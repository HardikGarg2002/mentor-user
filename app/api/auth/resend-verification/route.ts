import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken, saveToken } from "@/lib/tokens";
import { sendEmail, createVerificationEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal that the user doesn't exist
      return NextResponse.json(
        {
          message:
            "If your email exists in our system, a verification link has been sent.",
        },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        {
          message: "Your email is already verified. Please sign in.",
        },
        { status: 200 }
      );
    }

    // Generate new verification token
    const verificationToken = generateToken();

    // Save token to database
    await saveToken(
      user._id.toString(),
      verificationToken,
      "emailVerification"
    );

    // Create verification URL
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}`;

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: "Verify your email address",
        html: createVerificationEmailHtml(user.name, verificationUrl),
      });

      return NextResponse.json(
        {
          message:
            "Verification email sent. Please check your inbox and spam folder.",
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        {
          message: "Failed to send verification email. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
