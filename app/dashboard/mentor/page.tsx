import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  DollarSign,
  MessageCircle,
  Phone,
  Video,
  Users,
  Clock,
  FileText,
  Bell,
  Star,
  ChevronRight,
  Download,
  Eye,
  MessageSquare,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow, isFuture, parseISO } from "date-fns";
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
  console.log(mentor, "mentor");
  // Get dashboard data
  const upcomingSessions = await getUpcomingSessions(mentor.userId);
  const previousSessions = await getPreviousSessions(mentor.userId);
  const chatHistory = await getChatHistory(mentor.userId);
  const earnings = await getEarningsData(mentor.userId);
  const paymentHistory = await getPaymentHistory(mentor.userId);
  const notifications = await getNotifications(mentor.userId);
  const reviews = await getReviews(mentor.userId);
  const stats = await getMentorStats(mentor.userId);

  const getSessionIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "chat":
        return <MessageCircle className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const canJoinSession = (date: string, startTime: string) => {
    const sessionDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();
    const fifteenMinutesBefore = new Date(sessionDateTime);
    fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);

    return now >= fifteenMinutesBefore && now <= sessionDateTime;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "system":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      return format(new Date(`${date}T${time}`), "MMM d, yyyy h:mm a");
    } catch (error) {
      return `${date} ${time}`;
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return String(dateString);
    }
  };

  const formatTimeAgo = (dateString: string | Date) => {
    try {
      const date =
        typeof dateString === "string" ? parseISO(dateString) : dateString;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return String(dateString);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mentor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.total}</div>
            <p className="text-xs text-muted-foreground">
              ${earnings.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcoming} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.pending}</div>
            <p className="text-xs text-muted-foreground">
              From {earnings.upcomingSessionsCount} upcoming sessions
            </p>
          </CardContent>
        </Card>
      </div>

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
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getSessionIcon(session.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={session.menteeImage}
                                alt={session.menteeName}
                              />
                              <AvatarFallback>
                                {session.menteeName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-medium">
                              {session.menteeName}
                            </h3>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {formatDateTime(
                                String(session.date),
                                session.startTime
                              )}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1 inline" />
                            <span>{session.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(session.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          asChild
                        >
                          <Link href={`/sessions/${session.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button
                          variant={
                            canJoinSession(
                              String(session.date),
                              session.startTime
                            )
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          disabled={
                            !canJoinSession(
                              String(session.date),
                              session.startTime
                            )
                          }
                          asChild
                        >
                          <Link href={`/meeting/${session.id}`}>Join</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No upcoming sessions
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="previous">
          <Card>
            <CardHeader>
              <CardTitle>Previous Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {previousSessions.length > 0 ? (
                <div className="space-y-4">
                  {previousSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getSessionIcon(session.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={session.menteeImage}
                                alt={session.menteeName}
                              />
                              <AvatarFallback>
                                {session.menteeName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-medium">
                              {session.menteeName}
                            </h3>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {formatDateTime(
                                String(session.date),
                                session.startTime
                              )}
                            </span>
                          </div>
                          <div className="flex mt-1">
                            {session.rating &&
                              [...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < session.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          asChild
                        >
                          <Link href={`/sessions/${session.id}`}>
                            <Eye className="h-3 w-3" />
                            <span>View Feedback</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          asChild
                        >
                          <Link href={`/sessions/${session.id}/notes`}>
                            <PlusCircle className="h-3 w-3" />
                            <span>Add Notes</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No previous sessions
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats">
          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              {chatHistory.length > 0 ? (
                <div className="space-y-4">
                  {chatHistory.map((chat) => (
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
                        <Link href={`/dashboard/chats/${chat.id}`}>
                          View Chat
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No chat history
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border-b">
                    <div>
                      <p className="text-gray-500">Total Earnings</p>
                      <p className="text-2xl font-bold">${earnings.total}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-4 border-b">
                    <div>
                      <p className="text-gray-500">This Month</p>
                      <p className="text-xl font-semibold">
                        ${earnings.thisMonth}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border-b">
                    <div>
                      <p className="text-gray-500">Pending</p>
                      <p className="text-xl font-semibold">
                        ${earnings.pending}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <p className="text-gray-500">Next Payout</p>
                      <p className="text-xl font-semibold">
                        ${earnings.nextPayout}
                      </p>
                      <p className="text-sm text-gray-400">
                        Expected on{" "}
                        {earnings.payoutDate
                          ? formatDate(earnings.payoutDate)
                          : ""}
                      </p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href="/dashboard/mentor/earnings">
                      View Breakdown
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">${payment.amount}</h3>
                          <div className="text-sm text-gray-500">
                            {payment.date} · {payment.sessions} sessions
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          asChild
                        >
                          <Link
                            href={`/dashboard/mentor/payments/${payment.id}/invoice`}
                          >
                            <Download className="h-3 w-3" />
                            <span>Download Invoice</span>
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    No payment history
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            notification.type === "booking"
                              ? "bg-green-100"
                              : notification.type === "review"
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                          }`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Mark as Read</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No notifications
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={review.menteeImage}
                              alt={review.menteeName}
                            />
                            <AvatarFallback>
                              {review.menteeName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium">{review.menteeName}</h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </p>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-4">
                        {review.review}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        asChild
                      >
                        <Link href={`/sessions/${review.id}`}>
                          <Eye className="h-3 w-3" />
                          <span>View Session</span>
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-medium mb-2">Set Your Schedule</h3>
              <p className="text-gray-500 mb-4">
                Update your availability to let mentees know when you're free
                for sessions.
              </p>
              <Button asChild>
                <Link href="/dashboard/mentor/availability">
                  Manage Calendar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-3 text-primary" />
                  <span>Chat Session</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">
                    ${mentor.pricing.chat}/hr
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/mentor/pricing">Edit</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Video className="h-5 w-5 mr-3 text-primary" />
                  <span>Video Call</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">
                    ${mentor.pricing.video}/hr
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/mentor/pricing">Edit</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <span>Phone Call</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">
                    ${mentor.pricing.call}/hr
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/mentor/pricing">Edit</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
