import { RazorpayPayment } from "./razorpay-payment";

interface PaymentFormProps {
  sessionId: string;
  amount: number;
  mentorName: string;
}

export function PaymentForm({ sessionId }: PaymentFormProps) {
  return <RazorpayPayment sessionId={sessionId} />;
}
