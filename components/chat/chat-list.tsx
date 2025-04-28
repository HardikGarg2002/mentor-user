"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getUserChats } from "@/actions/chat-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatListShadow } from "./chat-list-shadow";
import ChatListSkeleton from "./chat-list-skeleton";

type ChatPreview = {
  id: string;
  otherUser: {
    id: string;
    name: string;
    image?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isFromUser: boolean;
  } | null;
  unreadCount: number;
  lastUpdated: string;
};

export function ChatList({
  basePath,
  userRole,
}: {
  basePath: string;
  userRole?: string;
}) {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChats() {
      try {
        const chatData = await getUserChats();
        setChats(chatData);
      } catch (error) {
        console.error("Error loading chats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadChats();

    // Poll for new messages every 10 seconds
    const interval = setInterval(loadChats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <ChatListSkeleton />;
  }

  if (chats.length === 0) {
    return <ChatListShadow />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>
          Your conversations with mentors and mentees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link key={chat.id} href={`${basePath}/${chat.id}`}>
              <div
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors ${
                  chat.unreadCount > 0 ? "bg-muted/50" : ""
                }`}
              >
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                  {chat.otherUser.image ? (
                    <Image
                      src={chat.otherUser.image || "/placeholder.svg"}
                      alt={chat.otherUser.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                      {chat.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium truncate">
                      {chat.otherUser.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {chat.lastMessage
                        ? formatDistanceToNow(new Date(chat.lastUpdated), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                  </div>

                  {chat.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage.isFromUser ? "You: " : ""}
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>

                {chat.unreadCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
