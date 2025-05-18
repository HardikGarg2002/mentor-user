import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken, deleteToken } from "@/lib/tokens";
import { Constants } from "@/config";
import mongoose from "mongoose";
import type { IToken } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < Constants.VALIDATION.PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        {
          message: `Password must be at least ${Constants.VALIDATION.PASSWORD_MIN_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    if (!Constants.VALIDATION.PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify the token
    const tokenDoc = (await verifyToken(token, "passwordReset")) as IToken & {
      _id: mongoose.Types.ObjectId;
    };

    if (!tokenDoc) {
      return NextResponse.json(
        {
          message: "Invalid or expired token. Please request a new reset link.",
        },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(tokenDoc.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the used token
    await deleteToken(tokenDoc._id);

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
