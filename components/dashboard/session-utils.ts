export function canJoinSession(date: string, startTime: string) {
  const sessionDateTime = new Date(`${date}T${startTime}`);
  const now = new Date();
  const fifteenMinutesBefore = new Date(sessionDateTime);
  fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);

  return now >= fifteenMinutesBefore && now <= sessionDateTime;
}
