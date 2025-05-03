import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageCircle,
  IndianRupee,
  Bell,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Notification {
  id: string;
  message: string;
  timestamp: string | Date;
  type: string;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  formatTimeAgo: (date: string | Date) => string;
}

export function Notifications({
  notifications,
  formatTimeAgo,
}: NotificationsProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "confirmation":
        return <Calendar className="h-4 w-4" />;
      case "payment":
        return <IndianRupee className="h-4 w-4" />;
      case "reminder":
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <Button variant="outline" size="sm">
          Mark All as Read
        </Button>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      notification.type === "confirmation"
                        ? "bg-green-100"
                        : notification.type === "payment"
                        ? "bg-blue-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(notification.timestamp)}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    <span>Mark as Read</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No notifications</p>
        )}
      </CardContent>
    </Card>
  );
}
