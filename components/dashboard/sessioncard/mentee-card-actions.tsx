"use client";
import { getSessionIcon, getStatusBadge } from "../ui-helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JoinSessionButton } from "./join-session-button";
import { ReviewDialog } from "./review-dialog";

// Card Action Buttons Component
interface CardActionsProps {
  id: string;
  isUpcoming: boolean;
  sessionStatus: string;
  sessionDate: string;
  sessionStartTime: string;
  type: string;
  isJoinable: boolean;
  otherUserId: string;
  rating?: number;
  mentorName: string;
}

export const MenteeCardActions = ({
  id,
  isUpcoming,
  sessionStatus,
  sessionDate,
  sessionStartTime,
  type,
  isJoinable,
  otherUserId,
  rating,
  mentorName,
}: CardActionsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
      <div className="bg-primary/10 p-2 rounded-full">
        {getSessionIcon(type)}
      </div>
      {isUpcoming && getStatusBadge(sessionStatus)}

      {!isUpcoming && !rating && (
        <ReviewDialog sessionId={id} mentorName={mentorName}>
          <Button size="sm">Leave Review</Button>
        </ReviewDialog>
      )}

      <Button variant="outline" size="sm" asChild>
        <Link href={`/sessions/${id}`}>View Details</Link>
      </Button>

      {isUpcoming && sessionStatus === "confirmed" && (
        <JoinSessionButton
          sessionId={id}
          sessionStatus={sessionStatus}
          sessionDate={sessionDate}
          sessionStartTime={sessionStartTime}
          sessionType={type as "video" | "call" | "chat"}
          isJoinable={isJoinable}
          otherUserId={otherUserId}
        />
      )}
    </div>
  );
};
