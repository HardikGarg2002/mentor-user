import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionCard } from "./sessioncard/session-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorReviews } from "./mentor-reviews";

const demoMentorSession = {
  id: "demo-session-1",
  name: "Alex Johnson",
  image: "https://i.pravatar.cc/150?img=1",
  title: "Frontend Developer",
  type: "video",
  sessionDate: new Date().toISOString(),
  sessionStatus: "completed",
  sessionStartTime: "14:00",
  sessionDuration: 60,
  rating: 4,
  isUpcoming: false,
  isMentor: true,
  review:
    "Really helpful session! Alex was patient and knowledgeable, explaining React concepts clearly. Would definitely book another session.",
};

const demoMenteeSession = {
  id: "demo-session-2",
  name: "Sarah Miller",
  image: "https://i.pravatar.cc/150?img=2",
  title: "React Expert",
  type: "video",
  sessionDate: new Date().toISOString(),
  sessionStatus: "completed",
  sessionStartTime: "10:00",
  sessionDuration: 45,
  rating: 0, // No rating yet
  isUpcoming: false,
  isMentor: false,
};

const upcomingSession = {
  id: "demo-session-3",
  name: "Michael Smith",
  image: "https://i.pravatar.cc/150?img=3",
  title: "Backend Developer",
  type: "chat",
  sessionDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  sessionStatus: "confirmed",
  sessionStartTime: "15:30",
  sessionDuration: 30,
  rating: 0,
  isUpcoming: true,
  isMentor: false,
};

export function ReviewSystemDemo() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Review System Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mentee">
          <TabsList className="mb-4">
            <TabsTrigger value="mentee">Mentee View</TabsTrigger>
            <TabsTrigger value="mentor">Mentor View</TabsTrigger>
            <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="mentee" className="space-y-4">
            <h3 className="text-sm font-medium mb-2">
              Past Session (Leave a Review)
            </h3>
            <SessionCard {...demoMenteeSession} />

            <h3 className="text-sm font-medium mb-2 mt-6">Upcoming Session</h3>
            <SessionCard {...upcomingSession} />

            <div className="p-4 mt-4 border rounded bg-amber-50/50">
              <p className="text-sm text-amber-700">
                <strong>Demo Note:</strong> The "Leave Review" button opens a
                dialog that normally submits to the server using our server
                action. In this demo, it's connected to a mock submission
                handler.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="mentor" className="space-y-4">
            <h3 className="text-sm font-medium mb-2">
              Past Session (View Feedback)
            </h3>
            <SessionCard {...demoMentorSession} />

            <div className="p-4 mt-4 border rounded bg-amber-50/50">
              <p className="text-sm text-amber-700">
                <strong>Demo Note:</strong> The "View Feedback" button opens a
                dialog component that can fetch review data from the API if not
                directly provided. In this demo, it's using the hardcoded review
                data.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">All Mentor Reviews</h3>
              <p className="text-sm text-gray-500 mb-4">
                This component fetches reviews from the server using our server
                action. For demonstration purposes, it will show loading state,
                but might not load actual data if the API endpoints aren't fully
                set up in your development environment.
              </p>

              <MentorReviews mentorId="demo123" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
