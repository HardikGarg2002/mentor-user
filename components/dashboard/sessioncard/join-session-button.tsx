import {
  MessageCircle,
  MessageCircleIcon,
  Phone,
  PhoneIcon,
  Video,
  VideoIcon,
} from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { StartChatButton } from "@/components/chat/start-chat-button";

interface JoinButtonProps {
  sessionId: string;
  sessionStatus: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionType: "video" | "call" | "chat";
  isJoinable: boolean;
  mentorPhone?: string;
  otherUserId: string;
}
export function JoinSessionButton({
  sessionId,
  sessionStatus,
  sessionDate,
  sessionStartTime,
  sessionType,
  isJoinable,
  mentorPhone = "+1234567890", // Default value as fallback
  otherUserId,
}: JoinButtonProps) {
  if (sessionType === "video") {
    return (
      <Button
        disabled={!isJoinable}
        className="flex items-center gap-1"
        asChild={isJoinable}
      >
        {isJoinable ? (
          <Link href={`/meeting/video?meetingId=${sessionId}`}>
            <VideoIcon className="h-4 w-4 mr-1" />
            Join Video
          </Link>
        ) : (
          <>
            <VideoIcon className="h-4 w-4 mr-1" />
            Join Video
          </>
        )}
      </Button>
    );
  } else if (sessionType === "call") {
    return (
      <>
        <Button disabled={!isJoinable} className="flex items-center gap-1">
          <PhoneIcon className="h-4 w-4 mr-1" />
          Join Call
        </Button>

        {isJoinable && (
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <Phone className="h-3 w-3 mr-1" />
            <span>{mentorPhone}</span>
          </div>
        )}
      </>
    );
  } else if (sessionType === "chat") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        asChild={isJoinable}
        disabled={!isJoinable}
      >
        {isJoinable ? (
          <StartChatButton otherUserId={otherUserId} />
        ) : (
          <>
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>Message</span>
          </>
        )}
      </Button>
    );
  }

  return null;
}
