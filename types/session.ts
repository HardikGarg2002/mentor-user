/**
 * Session Types
 * Types related to mentoring session formats and interactions
 */

// Session types available for booking
export type SessionType = "chat" | "video" | "call";

// Session status values
export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";

// Basic session information
export interface SessionInfo {
  id: string;
  mentorId: string;
  menteeId: string;
  type: SessionType;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: SessionStatus;
  price: number;
  timezone: string;
}

// Display-friendly session info (with names)
export interface SessionDisplay extends SessionInfo {
  mentorName?: string;
  mentorImage?: string;
  menteeName?: string;
  menteeImage?: string;
}
