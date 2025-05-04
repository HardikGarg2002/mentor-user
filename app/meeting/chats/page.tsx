import { ChatList } from "@/components/chat/chat-list";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ChatsPage() {
  const role = await getUserRole();

  if (!role) {
    return redirect("/auth/signin");
  }

  const basePath = "/chats";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      <ChatList basePath={basePath} userRole={role} />
    </div>
  );
}
