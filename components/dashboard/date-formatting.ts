import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDateTime(date: string, time: string) {
  try {
    return format(new Date(`${date}T${time}`), "MMM d, yyyy h:mm a");
  } catch (error) {
    return `${date} ${time}`;
  }
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
