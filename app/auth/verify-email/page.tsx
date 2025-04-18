"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<{
    isLoading: boolean;
    isSuccess: boolean;
    error: string | null;
  }>({
    isLoading: true,
    isSuccess: false,
    error: null,
  });

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setState({
          isLoading: false,
          isSuccess: false,
          error: "Invalid verification link. No token provided.",
        });
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setState({
            isLoading: false,
            isSuccess: true,
            error: null,
          });
        } else {
          setState({
            isLoading: false,
            isSuccess: false,
            error: data.message || "Failed to verify email.",
          });
        }
      } catch (error) {
        setState({
          isLoading: false,
          isSuccess: false,
          error: "An unexpected error occurred. Please try again.",
        });
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Email Verification
          </CardTitle>
          <CardDescription className="text-center">
            Verifying your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-6">
          {state.isLoading && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-center">Verifying your email...</p>
            </div>
          )}

          {state.isSuccess && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-lg text-center">
                Your email has been successfully verified!
              </p>
            </div>
          )}

          {!state.isLoading && state.error && (
            <div className="flex flex-col items-center space-y-4 w-full">
              <XCircle className="h-12 w-12 text-red-500" />
              <Alert variant="destructive" className="w-full">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {(state.isSuccess || (!state.isLoading && state.error)) && (
            <Button
              onClick={() => router.push("/auth/signin")}
              className="w-full max-w-xs"
            >
              Continue to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
