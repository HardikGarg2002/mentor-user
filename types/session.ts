/**
 * Session Types
 * Types related to mentoring session formats and interactions
 */
import mongoose, { type Document } from "mongoose";
import { Constants, DATETIME } from "@/config";

// Session types available for booking
export type SessionType = "chat" | "video" | "call";

// Session status values - derive from Constants
export type SessionStatus =
  (typeof Constants.SESSION_STATUS)[keyof typeof Constants.SESSION_STATUS];

// Create enum-like objects with TypeScript using the Constants
export const SessionStatus = {
  RESERVED: Constants.SESSION_STATUS.SCHEDULED,
  CONFIRMED: "confirmed" as SessionStatus,
  COMPLETED: Constants.SESSION_STATUS.COMPLETED,
  CANCELLED: Constants.SESSION_STATUS.CANCELLED,
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
