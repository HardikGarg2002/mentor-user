import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionCard } from "./sessioncard/session-card";

interface Session {
  id: string;
  menteeName: string;
  menteeImage: string;
  date: string | Date;
  startTime: string;
  duration: number;
  type: string;
  status: string;
  rating: number;
}

interface MentorSessionsProps {
  header: string;
  sessions: Session[];
  formatDateTime: (date: string, time: string) => string;
  isPastSession: boolean;
}

export function MentorSessions({
  header,
  sessions,
  isPastSession,
  formatDateTime,
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
              <SessionCard
                key={session.id}
                id={session.id}
                name={session.menteeName}
                title={undefined}
                image={session.menteeImage}
                type={session.type}
                sessionDate={session.date.toString()}
                sessionStatus={session.status}
                sessionStartTime={session.startTime}
                sessionDuration={session.duration}
                rating={session.rating}
                isUpcoming={!isPastSession}
                isMentor={true}
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
