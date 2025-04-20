import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Payment from "@/models/Payment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const metadata: Metadata = {
  title: "Payment Success",
  description: "Your payment has been successfully processed",
};

async function getSessionData(sessionId: string) {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session: any = await Session.findById(sessionId)
      .populate("mentorId", "name profileImage")
      .lean();

    if (!session) {
      return null;
    }

    const payment = await Payment.findOne({ sessionId: session._id }).lean();

    return {
      session: {
        id: session._id.toString(),
        type: session.meeting_type,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
        date: session.date,
      },
      mentor: {
        id: session.mentorId._id.toString(),
        name: session.mentorId.name,
        profileImage: session.mentorId.profileImage,
      },
      payment: payment
        ? {
            id: payment._id.toString(),
            amount: payment.amount,
            currency: payment.currency || "INR",
            status: payment.status,
            transactionId: payment.transactionId,
            paymentDate: payment.paymentDate,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching session data:", error);
    return null;
  }
}

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const userSession = await auth();
  if (!userSession || !userSession.user) {
    redirect("/auth/signin");
  }

  const sessionData = await getSessionData(sessionId);
  if (!sessionData) {
    redirect("/dashboard/mentee/sessions");
  }

  const { session, mentor, payment } = sessionData;
  const sessionDate = new Date(session.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //   const sessionTime = `${new Date(session.startTime).toLocaleTimeString(
  //     "en-US",
  //     {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }
  //   )} - ${new Date(session.endTime).toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   })}`;

  const sessionTime = `${session.startTime} - ${session.endTime}`;

  return (
    <div className="container max-w-3xl py-10">
      <Card className="border-green-100 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl md:text-3xl text-green-700">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Your session has been booked and confirmed.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-medium text-lg mb-4">Session Details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-1">
                <p className="text-gray-600 col-span-1">Session:</p>
                <p className="font-medium col-span-2">{session.type}</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="text-gray-600 col-span-1">Mentor:</p>
                <p className="font-medium col-span-2">{mentor.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="text-gray-600 col-span-1">Date:</p>
                <p className="font-medium col-span-2">{sessionDate}</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="text-gray-600 col-span-1">Time:</p>
                <p className="font-medium col-span-2">{sessionTime}</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="text-gray-600 col-span-1">Status:</p>
                <p className="font-medium text-green-600 col-span-2">
                  Confirmed
                </p>
              </div>
            </div>
          </div>

          {payment && (
            <div className="bg-gray-50 p-5 rounded-lg border">
              <h3 className="font-medium text-lg mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  <p className="text-gray-600 col-span-1">Amount:</p>
                  <p className="font-medium col-span-2">
                    {payment.currency} {payment.amount}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <p className="text-gray-600 col-span-1">Transaction ID:</p>
                  <p className="font-medium col-span-2">
                    {payment.transactionId}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <p className="text-gray-600 col-span-1">Payment Date:</p>
                  <p className="font-medium col-span-2">
                    {new Date(payment.paymentDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg text-blue-700 text-sm">
            <p>
              <span className="font-bold">Next Steps:</span> An email
              confirmation has been sent to your registered email address. You
              can join the session from your dashboard at the scheduled time.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-6">
          <Button asChild variant="default">
            <Link href={`/dashboard/mentee/sessions/${session.id}`}>
              View Session Details
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/mentee/sessions">Go to My Sessions</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
