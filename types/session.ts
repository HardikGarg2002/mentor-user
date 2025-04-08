/**
 * Session Types
 * Types related to mentoring session formats and interactions
 */
import mongoose, { type Document } from "mongoose";

// Session types available for booking
export type SessionType = "chat" | "video" | "call";

// Session status values
export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";

// Basic session information

export interface ISession extends Document {
  mentorId: mongoose.Types.ObjectId;
  menteeId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  meeting_type: SessionType;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  timezone: string;
  status: SessionStatus;
  price: number;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}
