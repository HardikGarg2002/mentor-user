import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken, deleteToken } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }

    await connectDB();

    // Verify the token
    const tokenDoc = await verifyToken(token, "emailVerification");

    if (!tokenDoc) {
      return NextResponse.json(
        {
          message:
            "Invalid or expired token. Please request a new verification link.",
        },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(tokenDoc.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.emailVerified) {
      await deleteToken(tokenDoc._id as any);
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    // Update user to verified
    user.emailVerified = true;
    await user.save();

    // Delete the token as it's been used
    await deleteToken(tokenDoc._id as any);

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
