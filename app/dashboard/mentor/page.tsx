import { auth } from "@/lib/auth";
import { getMentorByUserId } from "@/lib/mentors";
import {
  getUpcomingSessions,
  getPreviousSessions,
  getChatHistory,
  getEarningsData,
  getPaymentHistory,
  getNotifications,
  getReviews,
  getMentorStats,
} from "@/lib/utils/mentor-dashboard";
import { redirect } from "next/navigation";
import { MentorStats } from "@/components/dashboard/mentor-stats";
import { MentorDashboardTabs } from "@/components/dashboard/mentor-dashboard-tabs";
import {
  AvailabilityCard,
  PricingCard,
} from "@/components/dashboard/service-cards";
import {
  formatDateTime,
  formatDate,
  formatTimeAgo,
} from "@/components/dashboard/date-formatting";
import { canJoinSession } from "@/components/dashboard/session-utils";

export default async function MentorDashboard() {
  // Get the current authenticated user
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Get the mentor information from the user ID
  const mentor = await getMentorByUserId(session.user.id);

  if (!mentor) {
    redirect("/dashboard");
  }

  // Get dashboard data
  const upcomingSessions = await getUpcomingSessions(mentor.userId);
  const previousSessions = await getPreviousSessions(mentor.userId);
  const chatHistory = await getChatHistory(mentor.userId);
  const earnings = await getEarningsData(mentor.userId);
  const paymentHistory = await getPaymentHistory(mentor.userId);
  const notifications = await getNotifications(mentor.userId);
  const reviews = await getReviews(mentor.userId);
  const stats = await getMentorStats(mentor.userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mentor Dashboard</h1>

      <MentorStats earnings={earnings} stats={stats} />

      <MentorDashboardTabs
        upcomingSessions={upcomingSessions}
        previousSessions={previousSessions}
        chatHistory={chatHistory}
        earnings={earnings}
        paymentHistory={paymentHistory}
        notifications={notifications}
        reviews={reviews}
        formatDateTime={formatDateTime}
        formatDate={formatDate}
        formatTimeAgo={formatTimeAgo}
        canJoinSession={canJoinSession}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AvailabilityCard />
        <PricingCard pricing={mentor.pricing} />
      </div>
    </div>
  );
}
