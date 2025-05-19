import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Phone, Video } from "lucide-react";
import Link from "next/link";

interface MentorPricing {
  chat: number;
  video: number;
  call: number;
}

interface ServiceCardsProps {
  pricing: MentorPricing;
}

export function AvailabilityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Availability</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="text-center md:p-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="font-medium mb-2">Set Your Schedule</h3>
          <p className="text-gray-500 mb-4">
            Update your availability to let mentees know when you're free for
            sessions.
          </p>
          <Button asChild>
            <Link href="/dashboard/mentor/availability">Manage Calendar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PricingCard({ pricing }: ServiceCardsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Pricing</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-3 text-primary" />
              <span>Chat Session</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">₹{pricing.chat}/hr</span>
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
              <span className="font-semibold mr-2">₹{pricing.video}/hr</span>
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
              <span className="font-semibold mr-2">₹{pricing.call}/hr</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/mentor/pricing">Edit</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
