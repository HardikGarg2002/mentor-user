import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken, saveToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";
import { APP, AUTH } from "@/config";

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
      console.info("User not found");
      return NextResponse.json(
        {
          message:
            "If your email exists in our system, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateToken();

    // Save token to database
    await saveToken(user._id.toString(), resetToken, "passwordReset");

    // Create reset URL
    const baseUrl = APP.BASE_URL;
    const resetUrl = `${baseUrl}${AUTH.ROUTES.RESET_PASSWORD}?token=${resetToken}`;
    console.info("Reset URL:", resetUrl);
    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: "Reset your password",
        html: `
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      return NextResponse.json(
        {
          message:
            "If your email exists in our system, a password reset link has been sent.",
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      return NextResponse.json(
        {
          message: "Failed to send reset email. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
