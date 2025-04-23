"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MentorProfileError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Error Loading Profile</h1>
        <p className="text-muted-foreground mb-8">
          {error.message ||
            "There was a problem loading your mentor profile. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
