import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken, saveToken } from "@/lib/tokens";
import { sendEmail, createVerificationEmailHtml } from "@/lib/email";
import { Constants, API, APP, AUTH } from "@/config";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          code: Constants.ERROR_CODES.VALIDATION_ERROR,
        },
        { status: Constants.API_RESPONSES.BAD_REQUEST.CODE }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
          code: Constants.ERROR_CODES.VALIDATION_ERROR,
        },
        { status: 409 }
      );
    }

    // Check password requirements
    if (password.length < Constants.VALIDATION.PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        {
          message: `Password must be at least ${Constants.VALIDATION.PASSWORD_MIN_LENGTH} characters`,
          code: Constants.ERROR_CODES.VALIDATION_ERROR,
        },
        { status: Constants.API_RESPONSES.BAD_REQUEST.CODE }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: Constants.ROLES.USER,
      emailVerified: false,
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
    const baseUrl = APP.BASE_URL;
    const verificationUrl = `${baseUrl}${AUTH.ROUTES.VERIFY_EMAIL}?token=${verificationToken}`;

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
        { status: Constants.API_RESPONSES.CREATED.CODE }
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
        { status: Constants.API_RESPONSES.CREATED.CODE }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        message: Constants.API_RESPONSES.SERVER_ERROR.MESSAGE,
        code: Constants.ERROR_CODES.DATABASE_ERROR,
      },
      { status: Constants.API_RESPONSES.SERVER_ERROR.CODE }
    );
  }
}
