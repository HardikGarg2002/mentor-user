import { format, formatDistanceToNow, parseISO } from "date-fns";
import { DATETIME } from "@/config";

export function formatDateTime(
  sessionDate: Date | string,
  startTime: string
): string {
  const [hours, minutes] = startTime.split(":").map(Number);

  // Set time on the session date
  const dateTime = new Date(sessionDate);
  dateTime.setHours(hours, minutes, 0, 0);

  // Format using toLocaleString with configured timezone
  return dateTime.toLocaleString("en-IN", {
    timeZone: DATETIME.DEFAULT_TIMEZONE,
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
    return format(date, DATETIME.DISPLAY_DATE_FORMAT);
  } catch (error) {
    return String(dateString);
  }
}

export function formatTime(timeString: string | Date) {
  try {
    const time =
      typeof timeString === "string" ? new Date(timeString) : timeString;
    return format(time, DATETIME.DISPLAY_TIME_FORMAT);
  } catch (error) {
    return String(timeString);
  }
}

export function formatStandardDate(dateString: string | Date) {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return format(date, DATETIME.DATE_FORMAT);
  } catch (error) {
    return String(dateString);
  }
}

export function formatStandardDateTime(dateString: string | Date) {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return format(date, DATETIME.DATETIME_FORMAT);
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
