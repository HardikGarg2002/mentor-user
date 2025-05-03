import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Eye, PlusCircle } from "lucide-react";
import Link from "next/link";
import { getSessionIcon } from "./ui-helpers";
import { StarRating } from "./ui-helpers";

interface Session {
  id: string;
  menteeName: string;
  menteeImage: string;
  date: string | Date;
  startTime: string;
  type: string;
  rating?: number;
}

interface MentorPreviousSessionsProps {
  sessions: Session[];
  formatDateTime: (date: string, time: string) => string;
}

export function MentorPreviousSessions({
  sessions,
  formatDateTime,
}: MentorPreviousSessionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Sessions</CardTitle>
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
                    <StarRating rating={session.rating} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                    asChild
                  >
                    <Link href={`/sessions/${session.id}`}>
                      <Eye className="h-3 w-3" />
                      <span>View Feedback</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                    asChild
                  >
                    <Link href={`/sessions/${session.id}/notes`}>
                      <PlusCircle className="h-3 w-3" />
                      <span>Add Notes</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No previous sessions</p>
        )}
      </CardContent>
    </Card>
  );
}
