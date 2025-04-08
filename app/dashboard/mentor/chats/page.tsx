import { ChatList } from "@/components/chat/chat-list";

export default function MentorChatsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      <ChatList basePath="/dashboard/mentee/chats" />
    </div>
  );
}
