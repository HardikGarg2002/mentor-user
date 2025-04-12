/**
 * Central Types Export
 * Convenient access to all type definitions from one place
 */

// Re-export all types from specific modules
export * from "./availability";
export * from "./booking";
export * from "./session";
export * from "./mentor";

/**
 * Central Types and Constants
 * All types and constants used throughout the application in one place
 */

// =========================================
// SESSION TYPES
// =========================================

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

// =========================================
// AVAILABILITY TYPES
// =========================================

// Weekly availability slot as stored in the database
export interface WeeklyAvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
}

// Generated time slot for display in the booking interface
export interface TimeSlot {
  id: string; // Composite ID with date, time and availability ID
  startTime: string; // Formatted for display (e.g., "10:00 AM")
  endTime: string; // Formatted for display (e.g., "10:30 AM")
  rawStartTime: string; // Original HH:MM format
  rawEndTime: string; // Original HH:MM format
  isBooked: boolean; // Whether this slot is already booked
  duration: number; // Duration in minutes
}

// =========================================
// BOOKING TYPES
// =========================================

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

// =========================================
// MENTOR TYPES
// =========================================

// Pricing structure for mentor sessions
export interface MentorPricing {
  chat: number;
  video: number;
  call: number;
}

// Mentor experience entry
export interface MentorExperience {
  company: string;
  role: string;
  period: string;
}

// Mentor education entry
export interface MentorEducation {
  institution: string;
  degree: string;
  year: string;
}

// Complete mentor profile information
export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  image?: string;
  about: string;
  specialties: string[];
  experience: MentorExperience[];
  education: MentorEducation[];
  pricing: MentorPricing;
  rating?: number;
  reviewCount?: number;
}

// Minimal mentor information for listings
export interface MentorListItem {
  id: string;
  userId: string;
  name: string;
  title: string;
  image?: string;
  specialties: string[];
  pricing: MentorPricing;
  rating?: number;
  reviewCount?: number;
}

// Mentor filter options
export interface MentorFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  specialties?: string[];
  page?: number;
}

// =========================================
// AUTH TYPES
// =========================================

// User role types
export type UserRole = "user" | "mentor" | "admin";

// User session information
export interface UserSession {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  image?: string;
}

// =========================================
// CONSTANTS
// =========================================

// Days of the week definition
export const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// Session duration options (in minutes)
export const DURATION_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

// Common specialties for filtering
export const SPECIALTIES = [
  "React",
  "Node.js",
  "Python",
  "Data Science",
  "Machine Learning",
  "UX Design",
  "Product Management",
  "Marketing",
  "Career Advice",
  "Leadership",
];

// =========================================
// UTILITY FUNCTIONS
// =========================================

// Helper function to convert time string to minutes for comparison
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
