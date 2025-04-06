"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { createPayment } from "@/actions/payment-actions";

interface PaymentFormProps {
  sessionId: string;
  amount: number;
  mentorName: string;
}

export function PaymentForm({
  sessionId,
  amount,
  mentorName,
}: PaymentFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const result = await createPayment(sessionId, paymentMethod);

      if (result.success) {
        toast({
          title: "Payment Successful",
          description: `Your payment of $${amount} has been processed.`,
        });
        router.push(`/dashboard/mentee/sessions/${sessionId}`);
        router.refresh();
      } else {
        toast({
          title: "Payment Failed",
          description:
            result.error || "There was an error processing your payment.",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Pay for your session with {mentorName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Payment Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Session Fee</span>
                <span>${amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Platform Fee</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>${amount}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-lg">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                  Credit / Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-lg">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                  PayPal
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay $${amount}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
