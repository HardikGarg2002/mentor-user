import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MentorSessionCard } from "./mentor-session-card";

interface Session {
  id: string;
  menteeName: string;
  menteeImage: string;
  date: string | Date;
  startTime: string;
  duration: number;
  type: string;
  status: string;
}

interface MentorSessionsProps {
  header: string;
  sessions: Session[];
  formatDateTime: (date: string, time: string) => string;
  canJoinSession: (date: string, startTime: string) => boolean;
  isPastSession: boolean;
}

export function MentorSessions({
  header,
  sessions,
  isPastSession,
  formatDateTime,
  canJoinSession,
}: MentorSessionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{header}</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <MentorSessionCard
                key={session.id}
                session={session}
                formatDateTime={formatDateTime}
                canJoinSession={canJoinSession}
                isPastSession={isPastSession}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No {header}</p>
        )}
      </CardContent>
    </Card>
  );
}
