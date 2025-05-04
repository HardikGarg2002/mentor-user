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

interface JoinButtonProps {
  sessionId: string;
  sessionStatus: string;
  sessionDate: string;
  sessionStartTime: string;
}
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

type SessionType = "video" | "call" | "chat";
const mentorPhone = "+1234567890";
const menteeId = "1234567890";
export function JoinSessionButton({ sessionType }: { sessionType: string }) {
  if (sessionType === "video") {
    // Video meet icon
    return (
      <Button>
        <VideoIcon />
        Join
      </Button>
    );
  } else if (sessionType === "call") {
    return (
      <>
        <Button>
          <PhoneIcon />
          Join
        </Button>

        <div className="text-sm text-gray-500 flex items-center mt-1">
          <Phone className="h-3 w-3 mr-1" />
          <span>{mentorPhone}</span>
        </div>
      </>
    );
  } else if (sessionType === "chat") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        asChild
      >
        <Link href={`/chats/${menteeId}`}>
          <MessageCircle className="h-3 w-3" />
          <span>Message</span>
        </Link>
      </Button>
    );
  }
}
