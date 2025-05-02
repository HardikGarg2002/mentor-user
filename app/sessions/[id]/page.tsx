import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
// import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
// import { VideoCallButton } from "@/components/video-call/video-call-button";
import { StartChatButton } from "@/components/chat/start-chat-button";
import { PaymentForm } from "@/components/payment/payment-form";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import Payment from "@/models/Payment";
import { auth } from "@/lib/auth";
import { SessionStatus } from "@/types/session";

export default async function SessionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "user" && session.user.role !== "mentor")
  ) {
    notFound();
  }

  await connectDB();

  // Get the current user
  const currentUser = await User.findOne({ email: session.user.email });
  if (!currentUser) {
    notFound();
  }

  // Find the session
  const sessionRecord = await Session.findById(id);
  if (!sessionRecord) {
    notFound();
  }

  // Check if the current user is the mentee or mentor for this session
  const isMentee = sessionRecord.menteeId.equals(currentUser._id);
  const isMentor = sessionRecord.mentorId.equals(currentUser._id);

  if (!isMentee && !isMentor) {
    notFound();
  }

  // Get the other user (mentor if current user is mentee, mentee if current user is mentor)
  const otherUserId = isMentee
    ? sessionRecord.mentorId
    : sessionRecord.menteeId;
  const otherUser = await User.findById(otherUserId);
  if (!otherUser) {
    notFound();
  }

  // Check if payment exists
  const payment = await Payment.findOne({ sessionId: sessionRecord._id });
  const isPaid =
    payment !== null ||
    sessionRecord.status === "confirmed" ||
    sessionRecord.status === "completed";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Session Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {isMentee ? "Mentor" : "Mentee"}
                  </h3>
                  <p className="text-lg">{otherUser.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className="mt-1">
                    {sessionRecord.status.charAt(0).toUpperCase() +
                      sessionRecord.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-lg">
                    {format(new Date(sessionRecord.date), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Time</h3>
                  <p className="text-lg">
                    {sessionRecord.startTime} - {sessionRecord.endTime}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Duration
                  </h3>
                  <p className="text-lg">{sessionRecord.duration} minutes</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="text-lg capitalize">
                    {sessionRecord.meeting_type}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="text-lg">₹{sessionRecord.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Timezone
                  </h3>
                  <p className="text-lg">{sessionRecord.timezone}</p>
                </div>
              </div>

              {sessionRecord.status === "confirmed" &&
                sessionRecord.meeting_type === "video" && (
                  <div className="flex gap-4 mt-6">
                    {/* <VideoCallButton sessionId={params.id} /> */}
                    <StartChatButton otherUserId={otherUser._id.toString()} />
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        <div>
          {isMentee &&
          sessionRecord.status === SessionStatus.RESERVED &&
          !isPaid ? (
            <PaymentForm
              sessionId={id}
              amount={sessionRecord.price}
              mentorName={otherUser.name}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isMentor ? "Session Status" : "Payment Status"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPaid ? (
                  <div className="bg-green-50 p-4 rounded-lg text-green-800 text-center">
                    <p className="font-medium">
                      {isMentor ? "Session Confirmed" : "Payment Complete"}
                    </p>
                    <p className="text-sm mt-1">
                      {isMentor
                        ? "This session has been paid for and confirmed."
                        : "Your session has been paid for."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-center">
                    <p className="font-medium">
                      {isMentor ? "Awaiting Payment" : "Payment Required"}
                    </p>
                    <p className="text-sm mt-1">
                      {isMentor
                        ? "Waiting for the mentee to complete payment."
                        : "Please complete payment to confirm your session."}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Session Actions
                  </h3>
                  <div className="space-y-2">
                    <StartChatButton
                      otherUserId={otherUser._id.toString()}
                      className="w-full"
                    />
                    {sessionRecord.status === "cancelled" && isMentee && (
                      <Button variant="outline" className="w-full">
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
