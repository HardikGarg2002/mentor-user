import mongoose from "mongoose";

export enum UserRole {
  USER = "user",
  MENTOR = "mentor",
  ADMIN = "admin",
}
export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}

export interface IUser extends UserSession {
  _id?: string | mongoose.Types.ObjectId;
  emailVerified?: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
