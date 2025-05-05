import { Badge } from "@/components/ui/badge";
import { Video, MessageCircle, Phone } from "lucide-react";
import { PaymentStatus } from "@/types/payment";

export function getSessionIcon(type: string) {
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
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "confirmed":
    case PaymentStatus.COMPLETED:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          {status === PaymentStatus.COMPLETED ? "Completed" : "Confirmed"}
        </Badge>
      );
    case "pending":
    case PaymentStatus.PENDING:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Completed
        </Badge>
      );
    case "cancelled":
    case PaymentStatus.FAILED:
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          {status === PaymentStatus.FAILED ? "Failed" : "Cancelled"}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

export function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;

  return (
    <div className="flex mt-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}
