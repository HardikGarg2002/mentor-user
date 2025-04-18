/**
 * Booking Types
 * Types related to booking sessions and appointments
 */

import { SessionType } from "./session";

// Form data for booking a session
export interface BookingFormData {
  mentorId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  availabilityId: string;
  type: SessionType;
  duration: number; // in minutes
  timezone: string;
}

// Booking slot that has been reserved
export interface BookedSlot {
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

// Session duration options (in minutes)
export const DURATION_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];
