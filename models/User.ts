import { IUser, UserRole } from "@/types/auth";
import mongoose, { Schema, type Model } from "mongoose";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: true },
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in development due to hot reloading
const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
