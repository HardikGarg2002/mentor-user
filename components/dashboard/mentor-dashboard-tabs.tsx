import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorUpcomingSessions } from "./mentor-upcoming-sessions";
import { MentorPreviousSessions } from "./mentor-previous-sessions";
import { MentorChatHistory } from "./mentor-chat-history";
import { EarningsOverview } from "./earnings-overview";
import { Notifications } from "./notifications";
import { Reviews } from "./reviews";

interface MentorDashboardTabsProps {
  upcomingSessions: any[];
  previousSessions: any[];
  chatHistory: any[];
  earnings: any;
  paymentHistory: any[];
  notifications: any[];
  reviews: any[];
  formatDateTime: (date: string, time: string) => string;
  formatDate: (date: string | Date) => string;
  formatTimeAgo: (date: string | Date) => string;
  canJoinSession: (date: string, startTime: string) => boolean;
}

export function MentorDashboardTabs({
  upcomingSessions,
  previousSessions,
  chatHistory,
  earnings,
  paymentHistory,
  notifications,
  reviews,
  formatDateTime,
  formatDate,
  formatTimeAgo,
  canJoinSession,
}: MentorDashboardTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="mb-8">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
        <TabsTrigger value="previous">Previous Sessions</TabsTrigger>
        <TabsTrigger value="chats">Chat History</TabsTrigger>
        <TabsTrigger value="earnings">Earnings</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <MentorUpcomingSessions
          sessions={upcomingSessions}
          formatDateTime={formatDateTime}
          canJoinSession={canJoinSession}
        />
      </TabsContent>

      <TabsContent value="previous">
        <MentorPreviousSessions
          sessions={previousSessions}
          formatDateTime={formatDateTime}
        />
      </TabsContent>

      <TabsContent value="chats">
        <MentorChatHistory chats={chatHistory} formatTimeAgo={formatTimeAgo} />
      </TabsContent>

      <TabsContent value="earnings">
        <EarningsOverview
          earnings={earnings}
          paymentHistory={paymentHistory}
          formatDate={formatDate}
        />
      </TabsContent>

      <TabsContent value="notifications">
        <Notifications
          notifications={notifications}
          formatTimeAgo={formatTimeAgo}
        />
      </TabsContent>

      <TabsContent value="reviews">
        <Reviews reviews={reviews} formatDate={formatDate} />
      </TabsContent>
    </Tabs>
  );
}
