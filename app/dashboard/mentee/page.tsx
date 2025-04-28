import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MessageCircle,
  Phone,
  Video,
  DollarSign,
  Users,
  Bell,
  MessageSquare,
  Clock,
  Download,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/search/search-bar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  getUpcomingSessions,
  getPastSessions,
  getChatHistory,
  getPaymentHistory,
  getNotifications,
  getRecommendedMentors,
  getMenteeStats,
} from "@/lib/utils/mentee-dashboard";
import { PaymentStatus } from "@/types/payment";
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
  const recommendedMentors = await getRecommendedMentors(menteeId);
  const stats = await getMenteeStats(menteeId);

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "confirmation":
        return <Calendar className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "reminder":
        return <Clock className="h-4 w-4" />;
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
      <h1 className="text-3xl font-bold mb-8">Mentee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent}</div>
            <p className="text-xs text-muted-foreground">
              Over {stats.completed} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Mentors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueMentors}</div>
            <p className="text-xs text-muted-foreground">
              Connected with {stats.uniqueMentors} mentors
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <SearchBar
          className="max-w-xl"
          placeholder="Search for mentors by skill, industry, or name..."
        />
      </div>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
          <TabsTrigger value="chats">Chat History</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={session.mentorImage}
                            alt={session.mentorName}
                          />
                          <AvatarFallback>
                            {session.mentorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{session.mentorName}</h3>
                          <p className="text-sm text-gray-500">
                            {session.mentorTitle}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
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
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getSessionIcon(session.type)}
                        </div>
                        {getStatusBadge(session.status)}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/sessions/${session.id}`}>
                            View Details
                          </Link>
                        </Button>
                        {session.status === "confirmed" && (
                          <Button size="sm" asChild>
                            <Link href={`/meeting/${session.id}`}>Join</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center mt-4">
                    <Button asChild>
                      <Link href="/mentors">Book More Sessions</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No upcoming sessions</p>
                  <Button asChild>
                    <Link href="/mentors">Find a Mentor</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {pastSessions.length > 0 ? (
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={session.mentorImage}
                            alt={session.mentorName}
                          />
                          <AvatarFallback>
                            {session.mentorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{session.mentorName}</h3>
                          <p className="text-sm text-gray-500">
                            {session.mentorTitle}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
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
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getSessionIcon(session.type)}
                        </div>
                        {!session.rated && (
                          <Button size="sm" asChild>
                            <Link href={`/sessions/${session.id}/review`}>
                              Leave Review
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/sessions/${session.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No past sessions
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
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={chat.mentorImage}
                            alt={chat.mentorName}
                          />
                          <AvatarFallback>
                            {chat.mentorName.charAt(0)}
                          </AvatarFallback>
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
                          <p className="text-sm text-gray-500">
                            {chat.mentorTitle}
                          </p>
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

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            payment.status === PaymentStatus.COMPLETED
                              ? "bg-green-100"
                              : payment.status === PaymentStatus.PENDING
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}
                        >
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            ${payment.amount} {payment.currency}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {payment.mentorName} - {formatDate(payment.date)}
                          </p>
                          <div className="text-xs text-gray-400 mt-1">
                            {getSessionIcon(payment.sessionType)}{" "}
                            {payment.sessionType} session
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(payment.status)}
                        {/* {payment.status === PaymentStatus.COMPLETED && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                            asChild
                          >
                            <Link
                              href={`/dashboard/mentee/payments/${payment.id}/receipt`}
                            >
                              <Download className="h-3 w-3" />
                              <span>Receipt</span>
                            </Link>
                          </Button>
                        )} */}
                      </div>
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
                            notification.type === "confirmation"
                              ? "bg-green-100"
                              : notification.type === "payment"
                              ? "bg-blue-100"
                              : "bg-yellow-100"
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
      </Tabs>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Recommended Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedMentors.map((mentor) => (
            <Card key={mentor.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.image} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{mentor.name}</h3>
                      <p className="text-sm text-gray-500">{mentor.title}</p>
                      <div className="flex items-center mt-1">
                        <svg
                          className="h-4 w-4 text-yellow-500 fill-yellow-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="ml-1 text-sm">{mentor.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link href={`/mentors/${mentor.id}`}>
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
