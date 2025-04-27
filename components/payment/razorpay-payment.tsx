"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/actions/payment-actions";

interface RazorpayPaymentProps {
  sessionId: string;
}

export function RazorpayPayment({ sessionId }: RazorpayPaymentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    order: any;
    amount: number;
    currency: string;
    mentorName: string;
    reservationExpires?: string;
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTimeRemaining = (expiryTime: Date) => {
    const now = new Date();
    const diffMs = expiryTime.getTime() - now.getTime();

    if (diffMs <= 0) {
      return "Expired";
    }

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (orderDetails?.reservationExpires) {
      const expiryTime = new Date(orderDetails.reservationExpires);

      setTimeRemaining(formatTimeRemaining(expiryTime));

      timerIntervalRef.current = setInterval(() => {
        const timeLeft = formatTimeRemaining(expiryTime);
        setTimeRemaining(timeLeft);

        if (timeLeft === "Expired") {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          toast.error("Reservation Expired", {
            description:
              "Your session reservation has expired. Please try booking again.",
          });
          router.push(`/sessions`);
        }
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [orderDetails?.reservationExpires, router]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const response = await createRazorpayOrder(sessionId);
        if (response.success) {
          setOrderDetails({
            order: response.order,
            amount: response.amount,
            currency: response.currency,
            mentorName: response.mentorName,
            reservationExpires: response.reservationExpires,
          });
        } else {
          toast.error("Error", {
            description: response.error || "Failed to create payment order",
          });
          if (
            response.error === "This session is not reserved" ||
            response.error === "This session has already been confirmed"
          ) {
            router.push("/sessions");
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Error", {
          description: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, router]);

  useEffect(() => {
    return () => {
      // Clear timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [sessionId]);

  const handlePayment = () => {
    if (!orderDetails) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderDetails.order.amount,
      currency: orderDetails.currency,
      name: "Aricious",
      description: "Session Payment",
      order_id: orderDetails.order.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (response: any) {
        // Handle payment success
        try {
          const verificationResponse = await verifyRazorpayPayment(
            sessionId,
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );

          if (verificationResponse.success) {
            toast.success("Payment Successful", {
              description: `Your payment of ${orderDetails.currency} ${orderDetails.amount} has been processed.`,
            });
            router.push(`/payment/success/${sessionId}`);
            router.refresh();
          } else {
            toast.error("Payment Verification Failed", {
              description:
                verificationResponse.error ||
                "There was an error verifying your payment.",
            });
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment Error", {
            description:
              "An unexpected error occurred during payment verification.",
          });
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    // Initialize Razorpay checkout
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const razorpayInstance = new (window as any).Razorpay(options);
    razorpayInstance.open();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Payment Details</CardTitle>
          <CardDescription>Please wait...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!orderDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Failed</CardTitle>
          <CardDescription>
            Failed to load payment details. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>
            Pay for your session with {orderDetails.mentorName}
            {timeRemaining && (
              <div className="mt-2 text-amber-600 font-medium">
                Time remaining: {timeRemaining}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Session Fee</span>
                  <span>
                    {orderDetails.currency} {orderDetails.amount}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Platform Fee</span>
                  <span>{orderDetails.currency} 0</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {orderDetails.currency} {orderDetails.amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handlePayment}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : `Pay ${orderDetails.currency} ${orderDetails.amount}`}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
