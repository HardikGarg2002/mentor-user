import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { StarRating } from "./ui-helpers";

interface BaseSessionProps {
  id: string;
  name: string;
  title: string;
  image: string;
  sessionDate: string | Date;
  sessionStartTime: string;
  sessionDuration: number;
  sessionStatus: string;
  type: string;
  formatDateTime: (date: string, time: string) => string;
}

interface UpcomingSessionProps extends BaseSessionProps {
  isUpcoming: true;
}

interface PreviousSessionProps extends BaseSessionProps {
  rating?: number;
  rated?: boolean;
  isUpcoming: false;
}

type MenteeSessionCardProps = UpcomingSessionProps | PreviousSessionProps;

export function MenteeSessionCard(props: MenteeSessionCardProps) {
  const {
    id,
    name,
    title,
    image,
    sessionDate,
    sessionStartTime,
    sessionDuration,
    sessionStatus,
    type,
    formatDateTime,
    isUpcoming,
  } = props;

  const isPreviousSession = (
    session: MenteeSessionCardProps
  ): session is PreviousSessionProps => {
    return !session.isUpcoming;
  };

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
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDateTime(String(sessionDate), sessionStartTime)}</span>
          </div>
          {isUpcoming && (
            <div className="text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1 inline" />
              <span>{sessionDuration} minutes</span>
            </div>
          )}
          {isPreviousSession(props) && props.rating && (
            <div className="flex mt-1">
              <StarRating rating={props.rating} />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-2 rounded-full">
          {getSessionIcon(type)}
        </div>
        {isUpcoming && getStatusBadge(sessionStatus)}
        {isPreviousSession(props) && !props.rated && (
          <Button size="sm" asChild>
            <Link href={`/sessions/${id}/review`}>Leave Review</Link>
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/sessions/${id}`}>View Details</Link>
        </Button>
        {isUpcoming && sessionStatus === "confirmed" && (
          <Button size="sm" asChild>
            <Link href={`/meeting/${id}`}>Join</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
