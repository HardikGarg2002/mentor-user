import { getStatusBadge } from "../ui-helpers";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { JoinSessionButton } from "./join-session-button";
// Card Action Buttons Component
interface CardActionsProps {
  id: string;
  isUpcoming: boolean;
  sessionStatus: string;
  sessionType: string;
}

export const MentorCardActions = ({
  id,
  isUpcoming,
  sessionStatus,
  sessionType,
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

  return (
    <div className="flex items-center space-x-2 mt-3 md:mt-0">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-1"
        asChild
      >
        <Link href={`/sessions/${id}`}>
          <Eye className="h-3 w-3" />
          <span>View Feedback</span>
        </Link>
      </Button>
    </div>
  );
};
