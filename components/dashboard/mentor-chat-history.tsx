import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface ChatItem {
  id: string;
  menteeName: string;
  menteeImage: string;
  lastMessage: string;
  timestamp: string | Date;
  unread: boolean;
}

interface MentorChatHistoryProps {
  chats: ChatItem[];
  formatTimeAgo: (date: string | Date) => string;
}

export function MentorChatHistory({
  chats,
  formatTimeAgo,
}: MentorChatHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat History</CardTitle>
      </CardHeader>
      <CardContent>
        {chats.length > 0 ? (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={chat.menteeImage}
                          alt={chat.menteeName}
                        />
                        <AvatarFallback>
                          {chat.menteeName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium flex items-center">
                        {chat.menteeName}
                        {chat.unread && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            New
                          </Badge>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 truncate max-w-[250px]">
                      {chat.lastMessage}
                    </p>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(chat.timestamp)}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/chats/${chat.id}`}>View Chat</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No chat history</p>
        )}
      </CardContent>
    </Card>
  );
}
