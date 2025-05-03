import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { getSessionIcon, getStatusBadge, StarRating } from "./ui-helpers";

export function MentorSessionCard({
  session,
  formatDateTime,
  canJoinSession,
  isPastSession,
}: {
  session: any;
  formatDateTime: (date: string, time: string) => string;
  canJoinSession: (date: string, startTime: string) => boolean;
  isPastSession: boolean;
}) {
  return (
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
              <AvatarImage src={session.menteeImage} alt={session.menteeName} />
              <AvatarFallback>{session.menteeName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium">{session.menteeName}</h3>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {formatDateTime(String(session.date), session.startTime)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            <Clock className="h-3 w-3 mr-1 inline" />
            <span>{session.duration} minutes</span>
          </div>
          {isPastSession && <StarRating rating={session.rating} />}
        </div>
      </div>
      {isPastSession ? (
        <PreviousSessionButtons session={session} />
      ) : (
        <UpcomingSessionButtons
          session={session}
          canJoinSession={canJoinSession}
        />
      )}
    </div>
  );
}

function PreviousSessionButtons({ session }: { session: any }) {
  return (
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
    </div>
  );
}

function UpcomingSessionButtons({
  session,
  canJoinSession,
}: {
  session: any;
  canJoinSession: (date: string, startTime: string) => boolean;
}) {
  return (
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
        disabled={!canJoinSession(String(session.date), session.startTime)}
        asChild
      >
        <Link href={`/meeting/${session.id}`}>Join</Link>
      </Button>
    </div>
  );
}
