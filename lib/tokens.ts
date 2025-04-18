import { randomBytes, createHash } from "crypto";
import connectDB from "@/lib/db";
import mongoose, { Document, Model } from "mongoose";

// Define the interface for the token document
interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  type: "emailVerification" | "passwordReset";
  createdAt: Date;
}

// Token schema
const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["emailVerification", "passwordReset"],
  },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // Token expires after 24 hours
});

// Create or get the model
const Token: Model<IToken> =
  (mongoose.models.Token as Model<IToken>) ||
  mongoose.model<IToken>("Token", TokenSchema);

// Generate a random token
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

// Hash a token
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Save token to database
export async function saveToken(
  userId: string,
  token: string,
  type: "emailVerification" | "passwordReset"
) {
  await connectDB();

  // Hash token before saving
  const hashedToken = hashToken(token);

  // Delete any existing tokens of the same type for this user
  await Token.deleteMany({ userId, type } as any);

  // Create new token
  const tokenDoc = new Token({
    userId,
    token: hashedToken,
    type,
  });

  return tokenDoc.save();
}

// Verify token
export async function verifyToken(
  token: string,
  type: "emailVerification" | "passwordReset"
) {
  await connectDB();

  // Hash the token to compare with stored hash
  const hashedToken = hashToken(token);

  // Find the token in the database
  const tokenDoc = await Token.findOne({ token: hashedToken, type } as any);

  if (!tokenDoc) {
    return null;
  }

  return tokenDoc;
}

// Delete token after use
export async function deleteToken(tokenId: mongoose.Types.ObjectId) {
  await connectDB();
  return Token.findByIdAndDelete(tokenId as any);
}
