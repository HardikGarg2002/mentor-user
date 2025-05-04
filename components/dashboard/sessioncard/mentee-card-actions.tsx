import { getSessionIcon, getStatusBadge } from "../ui-helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JoinSessionButton } from "./join-session-button";

// Card Action Buttons Component
interface CardActionsProps {
  id: string;
  isUpcoming: boolean;
  sessionStatus: string;
  type: string;
  rating?: number;
}

export const MenteeCardActions = ({
  id,
  isUpcoming,
  sessionStatus,
  type,
  rating,
}: CardActionsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
      <div className="bg-primary/10 p-2 rounded-full">
        {getSessionIcon(type)}
      </div>
      {isUpcoming && getStatusBadge(sessionStatus)}

      {!isUpcoming && !rating && (
        <Button size="sm" asChild>
          <Link href={`/sessions/${id}/review`}>Leave Review</Link>
        </Button>
      )}

      <Button variant="outline" size="sm" asChild>
        <Link href={`/sessions/${id}`}>View Details</Link>
      </Button>

      {isUpcoming && sessionStatus === "confirmed" && (
        <JoinSessionButton sessionType={type} />
      )}
    </div>
  );
};
