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
import { XCircle } from "lucide-react";

export default function NewsletterUnsubscribed() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Unsubscribed
          </CardTitle>
          <CardDescription className="text-center">
            You have been unsubscribed from our newsletter
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            We&apos;re sorry to see you go. You have been successfully
            unsubscribed from the ARicious newsletter.
          </p>
          <p className="text-sm text-gray-500">
            If you changed your mind, you can subscribe again anytime.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
          <Link href="/#newsletter">
            <Button variant="outline">Subscribe Again</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
