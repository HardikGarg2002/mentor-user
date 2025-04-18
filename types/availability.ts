/**
 * Availability Types
 * Types related to mentor availability and scheduling
 */

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

// Helper function to convert time string to minutes for comparison
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
