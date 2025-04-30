import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function NewsletterThankYou() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Subscription Confirmed!
          </CardTitle>
          <CardDescription className="text-center">
            Thank you for subscribing to our newsletter
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            You have successfully subscribed to the ARicious newsletter.
            We&apos;ll keep you updated with the latest news, tips, and
            resources.
          </p>
          <p className="text-sm text-gray-500">
            You can unsubscribe at any time by clicking the unsubscribe link in
            any of our emails.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
