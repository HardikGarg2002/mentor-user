/**
 * Session Types
 * Types related to mentoring session formats and interactions
 */
import mongoose, { type Document } from "mongoose";

// Session types available for booking
export type SessionType = "chat" | "video" | "call";

// Session status values
export type SessionStatus =
  | "reserved"
  | "confirmed"
  | "completed"
  | "cancelled";

// Create enum-like objects with TypeScript
export const SessionStatus = {
  RESERVED: "reserved" as SessionStatus,
  CONFIRMED: "confirmed" as SessionStatus,
  COMPLETED: "completed" as SessionStatus,
  CANCELLED: "cancelled" as SessionStatus,
};

// Basic session information
export interface ISession extends Document {
  mentorId: mongoose.Types.ObjectId;
  menteeId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  // No more reservedBy field - using menteeId for reservations
  reservationExpires?: Date;
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
