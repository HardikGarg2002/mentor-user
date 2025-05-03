import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { getSessionIcon, getStatusBadge } from "./ui-helpers";

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

interface MentorUpcomingSessionsProps {
  sessions: Session[];
  formatDateTime: (date: string, time: string) => string;
  canJoinSession: (date: string, startTime: string) => boolean;
}

export function MentorUpcomingSessions({
  sessions,
  formatDateTime,
  canJoinSession,
}: MentorUpcomingSessionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getSessionIcon(session.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={session.menteeImage}
                          alt={session.menteeName}
                        />
                        <AvatarFallback>
                          {session.menteeName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium">{session.menteeName}</h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {formatDateTime(
                          String(session.date),
                          session.startTime
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1 inline" />
                      <span>{session.duration} minutes</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(session.status)}
                  <Button variant="outline" size="sm" className="mr-2" asChild>
                    <Link href={`/sessions/${session.id}`}>View Details</Link>
                  </Button>
                  <Button
                    variant={
                      canJoinSession(String(session.date), session.startTime)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    disabled={
                      !canJoinSession(String(session.date), session.startTime)
                    }
                    asChild
                  >
                    <Link href={`/meeting/${session.id}`}>Join</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No upcoming sessions</p>
        )}
      </CardContent>
    </Card>
  );
}
