import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  MessageCircle,
  Phone,
  Video,
  Users,
  Clock,
} from "lucide-react";

// import Mentor from "@/models/Mentor";
// import { getMentorById } from "@/lib/mentors";
// import BookVideoCallDialog from "@/components/booking/VideomeetBooking";

export default async function MentorDashboard() {
  // Mock data - in a real app, this would come from a database
  const earnings = {
    total: 2450,
    thisMonth: 850,
    pending: 200,
  };

  const sessions = {
    completed: 27,
    upcoming: 3,
    cancelled: 2,
  };

  const upcomingSessions = [
    {
      id: 1,
      mentee: "John Smith",
      type: "video",
      date: "Mar 15, 2025",
      time: "10:00 AM - 11:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      mentee: "Emily Johnson",
      type: "chat",
      date: "Mar 16, 2025",
      time: "2:00 PM - 3:00 PM",
      status: "confirmed",
    },
    {
      id: 3,
      mentee: "Michael Brown",
      type: "call",
      date: "Mar 18, 2025",
      time: "4:00 PM - 5:00 PM",
      status: "pending",
    },
  ];

  const recentSessions = [
    {
      id: 4,
      mentee: "Sarah Williams",
      type: "video",
      date: "Mar 10, 2025",
      time: "11:00 AM - 12:00 PM",
      status: "completed",
      rating: 5,
    },
    {
      id: 5,
      mentee: "David Lee",
      type: "call",
      date: "Mar 8, 2025",
      time: "3:00 PM - 4:00 PM",
      status: "completed",
      rating: 4,
    },
    {
      id: 6,
      mentee: "Jessica Chen",
      type: "chat",
      date: "Mar 5, 2025",
      time: "1:00 PM - 2:00 PM",
      status: "completed",
      rating: 5,
    },
  ];

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
  // const mentor = await getMentorById("67d4709d9d1e7c742b328ade");

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
            <div className="text-2xl font-bold">{sessions.completed}</div>
            <p className="text-xs text-muted-foreground">
              {sessions.upcoming} upcoming
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
              From {sessions.upcoming} upcoming sessions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
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
                          <h3 className="font-medium">{session.mentee}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {session.date}, {session.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(session.status)}
                        <Button variant="outline" size="sm" className="mr-2">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/dashboard/mentor/availability">
                            Manage Availability
                          </a>
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

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getSessionIcon(session.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{session.mentee}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {session.date}, {session.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
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
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No recent sessions
                </p>
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
                Update your availability to let mentees know when youre free for
                sessions.
              </p>
              <Button>Manage Calendar</Button>
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
                  <span className="font-semibold mr-2">$50/hr</span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Video className="h-5 w-5 mr-3 text-primary" />
                  <span>Video Call</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">$100/hr</span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <span>Phone Call</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">$80/hr</span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <BookVideoCallDialog mentor={mentor} /> */}
      </div>
    </div>
  );
}
