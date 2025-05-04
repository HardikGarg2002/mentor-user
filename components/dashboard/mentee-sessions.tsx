import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionCard } from "./sessioncard/session-card";

interface Session {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorImage: string;
  date: string | Date;
  startTime: string;
  type: string;
  rating?: number;
  rated?: boolean;
  duration: number;
  status: string;
}

interface SessionListProps {
  sessions: Session[];
  formatDateTime: (date: string, time: string) => string;
  title: string;
  type: "upcoming" | "previous";
  emptyStateAction?: {
    label: string;
    href: string;
  };
}

export function SessionList({
  sessions,
  formatDateTime,
  title,
  type,
  emptyStateAction,
}: SessionListProps) {
  const isUpcoming = type === "upcoming";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                id={session.id}
                name={session.mentorName}
                title={session.mentorTitle}
                image={session.mentorImage}
                sessionDate={session.date}
                sessionStartTime={session.startTime}
                sessionDuration={session.duration}
                sessionStatus={session.status}
                type={session.type}
                isUpcoming={isUpcoming}
                rating={session.rating}
                isMentor={false}
              />
            ))}
            {isUpcoming && (
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <Link href="/mentors">Book More Sessions</Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">No {title}</p>
            {emptyStateAction && (
              <Button asChild>
                <Link href={emptyStateAction.href}>
                  {emptyStateAction.label}
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
