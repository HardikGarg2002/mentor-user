import { MenteeCardActions } from "./mentee-card-actions";
import { MentorCardActions } from "./mentor-card-actions";
import { SessionDetails } from "./session-details";

interface SessionCardProps {
  id: string;
  name: string;
  image: string;
  title: string;
  type: string;
  sessionDate: string | Date;
  sessionStatus: string;
  sessionStartTime: string;
  sessionDuration: number;
  rating: number;
  isUpcoming: boolean;
  isMentor: boolean;
  review?: string;
}

export function SessionCard({
  id,
  name,
  image,
  title,
  type,
  sessionDate,
  sessionStatus,
  sessionStartTime,
  sessionDuration,
  rating,
  isUpcoming,
  isMentor,
  review,
}: SessionCardProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
      <SessionDetails
        name={name}
        title={title}
        image={image}
        sessionDate={sessionDate}
        sessionStartTime={sessionStartTime}
        sessionDuration={sessionDuration}
        isUpcoming={isUpcoming}
        rating={rating}
      />
      {isMentor ? (
        <MentorCardActions
          id={id}
          isUpcoming={isUpcoming}
          sessionStatus={sessionStatus}
          sessionType={type}
          menteeName={name}
          rating={rating}
          review={review}
        />
      ) : (
        <MenteeCardActions
          id={id}
          isUpcoming={isUpcoming}
          sessionStatus={sessionStatus}
          type={type}
          rating={rating}
          mentorName={name}
        />
      )}
    </div>
  );
}
