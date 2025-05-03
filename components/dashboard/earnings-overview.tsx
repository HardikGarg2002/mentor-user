import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";
import Link from "next/link";

interface Earnings {
  total: number;
  thisMonth: number;
  pending: number;
  nextPayout: number;
  payoutDate: string | Date | null;
}

interface EarningsOverviewProps {
  earnings: Earnings;
  paymentHistory: {
    id: string;
    amount: number;
    date: string;
    sessions: number;
  }[];
  formatDate: (date: string | Date) => string;
}

export function EarningsOverview({
  earnings,
  paymentHistory,
  formatDate,
}: EarningsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">₹{earnings.total}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="text-gray-500">This Month</p>
                <p className="text-xl font-semibold">₹{earnings.thisMonth}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="text-gray-500">Pending</p>
                <p className="text-xl font-semibold">₹{earnings.pending}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4">
              <div>
                <p className="text-gray-500">Next Payout</p>
                <p className="text-xl font-semibold">₹{earnings.nextPayout}</p>
                <p className="text-sm text-gray-400">
                  Expected on{" "}
                  {earnings.payoutDate ? formatDate(earnings.payoutDate) : ""}
                </p>
              </div>
            </div>
            <Button className="w-full mt-4" asChild>
              <Link href="/dashboard/mentor/earnings">View Breakdown</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">₹{payment.amount}</h3>
                    <div className="text-sm text-gray-500">
                      {payment.date} · {payment.sessions} sessions
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                    asChild
                  >
                    <Link
                      href={`/dashboard/mentor/payments/${payment.id}/invoice`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>Download Invoice</span>
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No payment history</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
