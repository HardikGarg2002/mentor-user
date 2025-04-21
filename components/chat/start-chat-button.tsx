"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getOrCreateChat } from "@/actions/chat-actions";
import { useSession } from "next-auth/react";

export function StartChatButton({
  otherUserId,
  className,
}: {
  otherUserId: string;
  className?: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);

    try {
      const result = await getOrCreateChat(otherUserId);
      console.log("get or create chat result", result);
      if (result.success) {
        // Determine the correct path based on user role
        const basePath =
          session.user.role === "mentor"
            ? "/dashboard/mentor/chats"
            : "/dashboard/mentee/chats";

        router.push(`${basePath}/${result.chatId}`);
      } else {
        toast.error("Error", {
          description: result.error || "Failed to start chat",
        });
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStartChat}
      disabled={loading}
      variant="outline"
      className={className}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {loading ? "Starting chat..." : "Message"}
    </Button>
  );
}
