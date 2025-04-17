import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import NewsletterSubscriber from "@/models/Newsletter";
import { generateToken, hashToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";

// Schema for validation
const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, name } = result.data;

    await connectDB();

    // Check if the email is already subscribed
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });

    if (existingSubscriber) {
      // If already subscribed and verified
      if (existingSubscriber.isVerified && !existingSubscriber.unsubscribedAt) {
        return NextResponse.json(
          {
            success: false,
            message: "You are already subscribed to our newsletter",
          },
          { status: 200 }
        );
      }

      // If previously unsubscribed, reactivate
      if (existingSubscriber.unsubscribedAt) {
        existingSubscriber.unsubscribedAt = undefined;
        existingSubscriber.isVerified = false; // Require verification again

        // Generate and store a new token
        const token = generateToken();
        existingSubscriber.token = hashToken(token);
        await existingSubscriber.save();

        // Send verification email
        await sendVerificationEmail(email, name || "", token, req);

        return NextResponse.json(
          {
            success: true,
            message:
              "Thank you for re-subscribing! Please check your email to verify your subscription",
          },
          { status: 200 }
        );
      }

      // If not verified, send verification email again
      if (!existingSubscriber.isVerified) {
        // Generate and store a new token
        const token = generateToken();
        existingSubscriber.token = hashToken(token);
        await existingSubscriber.save();

        // Send verification email
        await sendVerificationEmail(email, name || "", token, req);

        return NextResponse.json(
          {
            success: true,
            message: "Please check your email to verify your subscription",
          },
          { status: 200 }
        );
      }
    }

    // New subscriber - create record
    const token = generateToken();
    const hashedToken = hashToken(token);

    const newSubscriber = new NewsletterSubscriber({
      email,
      name,
      token: hashedToken,
      isVerified: false,
    });

    await newSubscriber.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      name || "",
      token,
      req
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for subscribing! Please check your email to verify your subscription",
        previewUrl: emailResult.previewUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// Helper function to send verification email
async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
  req: NextRequest
) {
  const baseUrl =
    process.env.NEXTAUTH_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const verificationUrl = `${baseUrl}/api/newsletter/verify?token=${token}&email=${encodeURIComponent(
    email
  )}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Newsletter Subscription</h2>
      <p>Hello ${name || "there"},</p>
      <p>Thank you for subscribing to the MentorMatch newsletter! To complete your subscription, please click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Subscription</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${verificationUrl}</p>
      <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
      <p>Best regards,<br>The MentorMatch Team</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Verify Your Newsletter Subscription",
    html,
  });
}
