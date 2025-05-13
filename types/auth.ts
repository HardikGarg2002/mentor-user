import mongoose from "mongoose";
import { Constants } from "@/config";

// Create UserRole type from Constants.ROLES
export type UserRole = (typeof Constants.ROLES)[keyof typeof Constants.ROLES];

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: UserRole;
}

export interface IUser extends UserSession {
  _id?: string | mongoose.Types.ObjectId;
  emailVerified?: boolean;
  password: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
