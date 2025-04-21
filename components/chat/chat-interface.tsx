"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner"; // 🔥 Sonner import
import {
  getChatById,
  sendMessage,
  markMessagesAsRead,
} from "@/actions/chat-actions";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
  read: boolean;
};

type ChatData = {
  id: string;
  otherUser: {
    id: string;
    name: string;
    image?: string;
  };
  messages: Message[];
  lastUpdated: string;
};

export function ChatInterface({
  chatId,
  basePath,
}: {
  chatId: string;
  basePath: string;
}) {
  const router = useRouter();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadChat() {
      try {
        const data = await getChatById(chatId);
        setChatData(data);

        if (data) {
          await markMessagesAsRead(chatId);
        }
      } catch (error) {
        console.error("Error loading chat:", error);
        toast.error("Could not load messages", {
          description: "Something went wrong while fetching the chat.",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    }

    loadChat();
    const interval = setInterval(loadChat, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !chatData) return;

    setSending(true);

    try {
      const result = await sendMessage({
        content: message,
        recipientId: chatData.otherUser.id,
      });

      if (result.success) {
        setMessage("");

        // Optional: show a success toast
        toast.success("Message sent", {
          description: "Your message was delivered.",
          duration: 3000,
        });

        const newMessage: Message = {
          id: Date.now().toString(),
          content: message,
          timestamp: new Date().toISOString(),
          isFromUser: true,
          read: false,
        };

        setChatData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastUpdated: new Date().toISOString(),
          };
        });
      } else {
        toast.error("Message not sent", {
          description: result.error || "Failed to deliver your message.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Message failed", {
        description: "An unexpected error occurred while sending.",
        duration: 5000,
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <ChatInterfaceSkeleton />;
  }

  if (!chatData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Chat not found</h3>
          <p className="text-muted-foreground mb-4">
            This conversation doesn’t exist or you don’t have access to it.
          </p>
          <Button onClick={() => router.push(basePath)}>
            Back to Messages
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <CardHeader className="border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => router.push(basePath)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
              {chatData.otherUser.image ? (
                <Image
                  src={chatData.otherUser.image || "/placeholder.svg"}
                  alt={chatData.otherUser.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                  {chatData.otherUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <CardTitle>{chatData.otherUser.name}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {chatData.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-muted-foreground">
                No messages yet. Start the conversation by sending a message
                below.
              </p>
            </div>
          ) : (
            chatData.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isFromUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.isFromUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-end mt-1 text-xs opacity-70">
                    <span>
                      {formatDistanceToNow(new Date(msg.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                    {msg.isFromUser && (
                      <span className="ml-1">{msg.read ? "• Read" : ""}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (message.trim()) {
                  handleSendMessage(e);
                }
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={sending || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

function ChatInterfaceSkeleton() {
  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <Skeleton
                className={`h-20 ${i % 2 === 0 ? "w-2/3" : "w-1/2"} rounded-lg`}
              />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Skeleton className="flex-1 h-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}
