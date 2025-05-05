import { formatDateTime } from "../date-formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { StarRating } from "../ui-helpers";

export function SessionDetails({
  name,
  title,
  image,
  sessionDate,
  sessionStartTime,
  sessionDuration,
  isUpcoming,
  rating,
}: {
  name: string;
  title: string;
  image: string;
  sessionDate: string | Date;
  sessionStartTime: string;
  sessionDuration: number;
  isUpcoming: boolean;
  rating: number;
}) {
  return (
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
          <span>{formatDateTime(sessionDate, sessionStartTime)}</span>
        </div>
        {isUpcoming && (
          <div className="text-sm text-gray-500">
            <Clock className="h-3 w-3 mr-1 inline" />
            <span>{sessionDuration} minutes</span>
          </div>
        )}
        {!isUpcoming && rating && (
          <div className="flex mt-1">
            <StarRating rating={rating} />
          </div>
        )}
      </div>
    </div>
  );
}
