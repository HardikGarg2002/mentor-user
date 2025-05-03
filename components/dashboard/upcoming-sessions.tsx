import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

interface Session {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorImage: string;
  date: string | Date;
  startTime: string;
  duration: number;
  type: string;
  status: string;
}

interface UpcomingSessionsProps {
  sessions: Session[];
  formatDateTime: (date: string, time: string) => string;
}

export function UpcomingSessions({
  sessions,
  formatDateTime,
}: UpcomingSessionsProps) {
  const getSessionIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "chat":
        return <MessageCircle className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

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
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={session.mentorImage}
                      alt={session.mentorName}
                    />
                    <AvatarFallback>
                      {session.mentorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{session.mentorName}</h3>
                    <p className="text-sm text-gray-500">
                      {session.mentorTitle}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
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
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getSessionIcon(session.type)}
                  </div>
                  {getStatusBadge(session.status)}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/sessions/${session.id}`}>View Details</Link>
                  </Button>
                  {session.status === "confirmed" && (
                    <Button size="sm" asChild>
                      <Link href={`/meeting/${session.id}`}>Join</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link href="/mentors">Book More Sessions</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">No upcoming sessions</p>
            <Button asChild>
              <Link href="/mentors">Find a Mentor</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
