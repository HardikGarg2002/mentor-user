import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDateTime(
  sessionDate: Date | string,
  startTime: string
): string {
  const [hours, minutes] = startTime.split(":").map(Number);

  // Set time on the session date
  const dateTime = new Date(sessionDate);
  dateTime.setHours(hours, minutes, 0, 0);

  // Format using toLocaleString with Indian locale and timezone
  return dateTime.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(dateString: string | Date) {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return format(date, "MMM d, yyyy");
  } catch (error) {
    return String(dateString);
  }
}

export function formatTimeAgo(dateString: string | Date) {
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return String(dateString);
  }
}
