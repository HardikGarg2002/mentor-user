import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { StarRating } from "./ui-helpers";
import { MenteeSessionCard } from "./mentee-session-card";

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

  const getSessionIcon = (sessionType: string) => {
    switch (sessionType) {
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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) =>
              isUpcoming ? (
                <MenteeSessionCard
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
                  formatDateTime={formatDateTime}
                  isUpcoming={true}
                />
              ) : (
                <MenteeSessionCard
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
                  formatDateTime={formatDateTime}
                  rating={session.rating}
                  rated={session.rated}
                  isUpcoming={false}
                />
              )
            )}
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
