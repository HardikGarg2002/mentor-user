// "use server";

// /**
//  * Helper function to convert time string (HH:MM) to minutes
//  */
// export function convertTimeToMinutes(timeStr: string): number {
//   const [hours, minutes] = timeStr.split(":").map(Number);
//   return hours * 60 + minutes;
// }

// /**
//  * Format time for display (convert from 24-hour to 12-hour format)
//  */
// export function formatTimeForDisplay(timeStr: string): string {
//   const [hours, minutes] = timeStr.split(":").map(Number);
//   const period = hours >= 12 ? "PM" : "AM";
//   const displayHours = hours % 12 || 12;
//   return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
// }
