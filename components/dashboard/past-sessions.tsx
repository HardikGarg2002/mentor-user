import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Video, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

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
}

interface PastSessionsProps {
  sessions: Session[];
  formatDateTime: (date: string, time: string) => string;
}

export function PastSessions({ sessions, formatDateTime }: PastSessionsProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Sessions</CardTitle>
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
                    <div className="flex mt-1">
                      {session.rating &&
                        [...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < session.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getSessionIcon(session.type)}
                  </div>
                  {!session.rated && (
                    <Button size="sm" asChild>
                      <Link href={`/sessions/${session.id}/review`}>
                        Leave Review
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/sessions/${session.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No past sessions</p>
        )}
      </CardContent>
    </Card>
  );
}
