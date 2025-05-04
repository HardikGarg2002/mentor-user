import { getStatusBadge } from "../ui-helpers";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { JoinSessionButton } from "./join-session-button";
import { FeedbackDialog } from "./feedback-dialog";

// Card Action Buttons Component
interface CardActionsProps {
  id: string;
  isUpcoming: boolean;
  sessionStatus: string;
  sessionType: string;
  menteeName?: string;
  rating?: number;
  review?: string;
}

export const MentorCardActions = ({
  id,
  isUpcoming,
  sessionStatus,
  sessionType,
  menteeName = "Mentee",
  rating,
  review,
}: CardActionsProps) => {
  if (isUpcoming) {
    return (
      <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
        {getStatusBadge(sessionStatus)}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/sessions/${id}`}>View Details</Link>
        </Button>
        <JoinSessionButton sessionType={sessionType} />
      </div>
    );
  }

  const hasRatingOrCompletedSession = rating || sessionStatus === "completed";

  return (
    <div className="flex items-center space-x-2 mt-3 md:mt-0">
      {hasRatingOrCompletedSession ? (
        <FeedbackDialog
          sessionId={id}
          menteeName={menteeName}
          rating={rating}
          review={review}
        >
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Eye className="h-3 w-3" />
            <span>View Feedback</span>
          </Button>
        </FeedbackDialog>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
          asChild
        >
          <Link href={`/sessions/${id}`}>
            <Eye className="h-3 w-3" />
            <span>View Details</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
