import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Video, MessageCircle, Phone } from "lucide-react";
import { PaymentStatus } from "@/types/payment";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  mentorName: string;
  date: string | Date;
  sessionType: string;
  status: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
  formatDate: (date: string | Date) => string;
}

export function PaymentHistory({ payments, formatDate }: PaymentHistoryProps) {
  const getSessionIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "chat":
        return <MessageCircle className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case PaymentStatus.PENDING:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case PaymentStatus.FAILED:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      payment.status === PaymentStatus.COMPLETED
                        ? "bg-green-100"
                        : payment.status === PaymentStatus.PENDING
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                  >
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      ₹{payment.amount} {payment.currency}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {payment.mentorName} - {formatDate(payment.date)}
                    </p>
                    <div className="text-xs text-gray-400 mt-1">
                      {getSessionIcon(payment.sessionType)}{" "}
                      {payment.sessionType} session
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No payment history</p>
        )}
      </CardContent>
    </Card>
  );
}
