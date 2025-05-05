import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatHistory } from "./chat-history";
import { PaymentHistory } from "./payment-history";
import { Notifications } from "./notifications";
import { EarningsOverview } from "./earnings-overview";
import { Reviews } from "./reviews";
import { ReactNode } from "react";
import { MentorSessions } from "./mentor-sessions";
import { SessionList } from "./mentee-sessions";

interface DashboardTabsProps {
  isMentor?: boolean;
  upcomingSessions: any[];
  pastSessions?: any[];
  previousSessions?: any[]; // For mentor compatibility
  chatHistory: any[];
  payments?: any[];
  earnings?: any;
  paymentHistory?: any[];
  notifications: any[];
  reviews?: any[];
  formatDateTime: (date: string, time: string) => string;
  formatDate: (date: string | Date) => string;
  formatTimeAgo: (date: string | Date) => string;
}

interface TabDefinition {
  value: string;
  label: string | ((isMentor: boolean) => string);
  showFor?: (isMentor: boolean) => boolean;
  content: (props: DashboardTabsProps) => ReactNode;
}

export function DashboardTabs({
  isMentor = false,
  upcomingSessions,
  pastSessions = [],
  previousSessions,
  chatHistory,
  payments = [],
  earnings,
  paymentHistory = [],
  notifications,
  reviews = [],
  formatDateTime,
  formatDate,
  formatTimeAgo,
}: DashboardTabsProps) {
  const tabDefinitions: TabDefinition[] = [
    {
      value: "upcoming",
      label: "Upcoming Sessions",
      content: (props) =>
        props.isMentor ? (
          <MentorSessions
            header="Upcoming Sessions"
            sessions={props.upcomingSessions}
            isPastSession={false}
            formatDateTime={props.formatDateTime}
          />
        ) : (
          <SessionList
            sessions={upcomingSessions}
            formatDateTime={formatDateTime}
            header="Upcoming Sessions"
            type="upcoming"
            emptyStateAction={{
              label: "Find a Mentor",
              href: "/mentors",
            }}
          />
        ),
    },
    {
      value: "past",
      label: "Previous Sessions",
      content: (props) =>
        props.isMentor ? (
          <MentorSessions
            header="Previous Sessions"
            sessions={props.pastSessions || []}
            isPastSession={true}
            formatDateTime={props.formatDateTime}
          />
        ) : (
          <SessionList
            sessions={pastSessions}
            formatDateTime={formatDateTime}
            header="Past Sessions"
            type="previous"
          />
        ),
    },
    // {
    //   value: "chats",
    //   label: "Chat History",
    //   content: (props) => (
    //     <ChatHistory
    //       chats={props.chatHistory}
    //       formatTimeAgo={props.formatTimeAgo}
    //     />
    //   ),
    // },
    {
      value: "payments",
      label: (isMentor) => (isMentor ? "Earnings" : "Payments"),
      content: (props) =>
        props.isMentor ? (
          <EarningsOverview
            earnings={props.earnings}
            paymentHistory={props.paymentHistory}
            formatDate={props.formatDate}
          />
        ) : (
          <PaymentHistory
            payments={props.payments}
            formatDate={props.formatDate}
          />
        ),
    },
    {
      value: "notifications",
      label: "Notifications",
      content: (props) => (
        <Notifications
          notifications={props.notifications}
          formatTimeAgo={props.formatTimeAgo}
        />
      ),
    },
    {
      value: "reviews",
      label: "Reviews & Ratings",
      showFor: (isMentor) => isMentor,
      content: (props) => (
        <Reviews reviews={props.reviews} formatDate={props.formatDate} />
      ),
    },
  ];

  const visibleTabs = tabDefinitions.filter(
    (tab) => !tab.showFor || tab.showFor(isMentor)
  );

  return (
    <Tabs defaultValue="upcoming" className="mb-8">
      {/* Scrollable TabsList wrapper on mobile */}
      <div className="sm:overflow-visible overflow-x-auto whitespace-nowrap px-2">
        <TabsList className="w-max sm:w-auto">
          {visibleTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {typeof tab.label === "function"
                ? tab.label(isMentor)
                : tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {visibleTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content({
            isMentor,
            upcomingSessions,
            pastSessions,
            previousSessions,
            chatHistory,
            payments,
            earnings,
            paymentHistory,
            notifications,
            reviews,
            formatDateTime,
            formatDate,
            formatTimeAgo,
          })}
        </TabsContent>
      ))}
    </Tabs>
  );
}
