import { ChatInterface } from "@/components/chat/chat-interface";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const role = await getUserRole();

  if (!role) {
    return redirect("/auth/signin");
  }

  const { chatId } = await params;
  const basePath = "/chats";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold mb-8">Messages</h1>
        </div>
        <div className="md:col-span-2">
          <ChatInterface chatId={chatId} basePath={basePath} userRole={role} />
        </div>
      </div>
    </div>
  );
}
