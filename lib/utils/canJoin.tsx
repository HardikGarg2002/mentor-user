import moment from "moment-timezone";
/**
 * @param sessionDate - Date of the session
 * @param startTime - Start time of the session (HH:MM format)
 * @param endTime - End time of the session (HH:MM format)
 */
export function canJoinSession(
  sessionDate: Date,
  startTime: string,
  endTime: string
): boolean {
  const timezone = "Asia/Kolkata";
  const now = moment.tz(timezone);

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const sessionStart = new Date(sessionDate);
  sessionStart.setHours(startHour, startMinute, 0, 0);

  const sessionEnd = new Date(sessionDate);
  sessionEnd.setHours(endHour, endMinute, 0, 0);

  const joinableFrom = moment
    .tz(sessionStart, timezone)
    .subtract(10, "minutes");
  const joinableUntil = moment.tz(sessionEnd, timezone).add(10, "minutes");

  console.log("joinableFrom", joinableFrom.format());
  console.log("joinableUntil", joinableUntil.format());
  console.log("now", now.format());

  return now.isSameOrAfter(joinableFrom) && now.isSameOrBefore(joinableUntil);
}
