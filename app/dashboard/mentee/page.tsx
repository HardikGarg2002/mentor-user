import { SearchBar } from "@/components/search/search-bar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getUpcomingSessions,
  getPastSessions,
  getChatHistory,
  getPaymentHistory,
  getNotifications,
  getMenteeStats,
} from "@/lib/utils/mentee-dashboard";
import { MenteeStats } from "@/components/dashboard/mentee-stats";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import {
  formatDateTime,
  formatDate,
  formatTimeAgo,
} from "@/components/dashboard/date-formatting";
// import { MentorView } from "@/components/dashboard/mobile-view";

export default async function MenteeDashboard() {
  // Get the current authenticated user
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Get dashboard data
  const menteeId = session.user.id;
  const upcomingSessions = await getUpcomingSessions(menteeId);
  const pastSessions = await getPastSessions(menteeId);
  const chatHistory = await getChatHistory(menteeId);
  const payments = await getPaymentHistory(menteeId);
  const notifications = await getNotifications(menteeId);
  const stats = await getMenteeStats(menteeId);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Mentee Dashboard
      </h1>

      <MenteeStats stats={stats} />

      <div className="mb-6 sm:mb-8">
        <SearchBar
          className="max-w-xl"
          placeholder="Search for mentors by skill, industry, or name..."
        />
      </div>

      <DashboardTabs
        upcomingSessions={upcomingSessions}
        pastSessions={pastSessions}
        chatHistory={chatHistory}
        payments={payments}
        notifications={notifications}
        formatDate={formatDate}
        formatTimeAgo={formatTimeAgo}
      />
      {/* <MentorView /> */}
    </div>
  );
}
