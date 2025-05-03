import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, IndianRupee, Clock } from "lucide-react";

interface MentorStatsProps {
  earnings: {
    total: number;
    thisMonth: number;
    pending: number;
    upcomingSessionsCount: number;
  };
  stats: {
    completed: number;
    upcoming: number;
  };
}

export function MentorStats({ earnings, stats }: MentorStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{earnings.total}</div>
          <p className="text-xs text-muted-foreground">
            ₹{earnings.thisMonth} this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Sessions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed}</div>
          <p className="text-xs text-muted-foreground">
            {stats.upcoming} upcoming
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Payments
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{earnings.pending}</div>
          <p className="text-xs text-muted-foreground">
            From {earnings.upcomingSessionsCount} upcoming sessions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
