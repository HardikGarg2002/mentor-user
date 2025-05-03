import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface ChatItem {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorImage: string;
  lastMessage: string;
  timestamp: string | Date;
  unread: boolean;
}

interface ChatHistoryProps {
  chats: ChatItem[];
  formatTimeAgo: (date: string | Date) => string;
}

export function ChatHistory({ chats, formatTimeAgo }: ChatHistoryProps) {
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
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.mentorImage} alt={chat.mentorName} />
                    <AvatarFallback>{chat.mentorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{chat.mentorName}</h3>
                      {chat.unread && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{chat.mentorTitle}</p>
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
