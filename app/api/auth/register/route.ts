import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken, saveToken } from "@/lib/tokens";
import { sendEmail, createVerificationEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
      // User is not verified by default
      emailVerified: null,
    });

    await newUser.save();

    // Generate verification token
    const verificationToken = generateToken();

    // Save token to database
    await saveToken(
      newUser._id.toString(),
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
      const emailResult = await sendEmail({
        to: email,
        subject: "Verify your email address",
        html: createVerificationEmailHtml(name, verificationUrl),
      });

      return NextResponse.json(
        {
          message:
            "User created successfully. Please check your email to verify your account.",
          verified: false,
          // Include the preview URL if this is a test email
          previewUrl: emailResult.previewUrl,
        },
        { status: 201 }
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Even if email fails, user is created
      return NextResponse.json(
        {
          message:
            "User created successfully, but verification email could not be sent. Please contact support.",
          verified: false,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
