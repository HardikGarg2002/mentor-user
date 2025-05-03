import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingSessions } from "./upcoming-sessions";
import { PastSessions } from "./past-sessions";
import { ChatHistory } from "./chat-history";
import { PaymentHistory } from "./payment-history";
import { Notifications } from "./notifications";

interface DashboardTabsProps {
  upcomingSessions: any[];
  pastSessions: any[];
  chatHistory: any[];
  payments: any[];
  notifications: any[];
  formatDateTime: (date: string, time: string) => string;
  formatDate: (date: string | Date) => string;
  formatTimeAgo: (date: string | Date) => string;
}

export function DashboardTabs({
  upcomingSessions,
  pastSessions,
  chatHistory,
  payments,
  notifications,
  formatDateTime,
  formatDate,
  formatTimeAgo,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="mb-8">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
        <TabsTrigger value="past">Past Sessions</TabsTrigger>
        <TabsTrigger value="chats">Chat History</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <UpcomingSessions
          sessions={upcomingSessions}
          formatDateTime={formatDateTime}
        />
      </TabsContent>

      <TabsContent value="past">
        <PastSessions sessions={pastSessions} formatDateTime={formatDateTime} />
      </TabsContent>

      <TabsContent value="chats">
        <ChatHistory chats={chatHistory} formatTimeAgo={formatTimeAgo} />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentHistory payments={payments} formatDate={formatDate} />
      </TabsContent>

      <TabsContent value="notifications">
        <Notifications
          notifications={notifications}
          formatTimeAgo={formatTimeAgo}
        />
      </TabsContent>
    </Tabs>
  );
}
