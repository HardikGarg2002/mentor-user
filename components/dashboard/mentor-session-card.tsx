import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { getSessionIcon, getStatusBadge, StarRating } from "./ui-helpers";

export function MentorSessionCard({
  id,
  name,
  image,
  type,
  sessionDate,
  sessionStatus,
  sessionStartTime,
  sessionDuration,
  rating,
  formatDateTime,
  canJoinSession,
  isUpcoming,
}: {
  id: string;
  name: string;
  image: string;
  type: string;
  sessionDate: string;
  sessionStatus: string;
  sessionStartTime: string;
  sessionDuration: number;
  rating: number;
  formatDateTime: (date: string, time: string) => string;
  canJoinSession: (date: string, startTime: string) => boolean;
  isUpcoming: boolean;
}) {
  return (
    <div
      key={id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-2 rounded-full">
          {getSessionIcon(type)}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium">{name}</h3>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDateTime(String(sessionDate), sessionStartTime)}</span>
          </div>
          <div className="text-sm text-gray-500">
            <Clock className="h-3 w-3 mr-1 inline" />
            <span>{sessionDuration} minutes</span>
          </div>
          {!isUpcoming && <StarRating rating={rating} />}
        </div>
      </div>
      {isUpcoming ? (
        <UpcomingSessionButtons
          sessionId={id}
          sessionStatus={sessionStatus}
          sessionDate={sessionDate}
          sessionStartTime={sessionStartTime}
          canJoinSession={canJoinSession}
        />
      ) : (
        <PreviousSessionButtons sessionId={id} />
      )}
    </div>
  );
}

function PreviousSessionButtons({ sessionId }: { sessionId: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-1"
        asChild
      >
        <Link href={`/sessions/${sessionId}`}>
          <Eye className="h-3 w-3" />
          <span>View Feedback</span>
        </Link>
      </Button>
    </div>
  );
}

function UpcomingSessionButtons({
  sessionId,
  sessionStatus,
  sessionDate,
  sessionStartTime,
  canJoinSession,
}: {
  sessionId: string;
  sessionStatus: string;
  sessionDate: string;
  sessionStartTime: string;
  canJoinSession: (date: string, startTime: string) => boolean;
}) {
  return (
    <div className="flex items-center space-x-2">
      {getStatusBadge(sessionStatus)}
      <Button variant="outline" size="sm" className="mr-2" asChild>
        <Link href={`/sessions/${sessionId}`}>View Details</Link>
      </Button>
      <Button
        variant={
          canJoinSession(String(sessionDate), sessionStartTime)
            ? "default"
            : "outline"
        }
        size="sm"
        disabled={!canJoinSession(String(sessionDate), sessionStartTime)}
        asChild
      >
        <Link href={`/meeting/${sessionId}`}>Join</Link>
      </Button>
    </div>
  );
}
