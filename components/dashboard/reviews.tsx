import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import Link from "next/link";
import { StarRating } from "./ui-helpers";

interface Review {
  id: string;
  menteeName: string;
  menteeImage: string;
  date: string | Date;
  rating: number;
  review: string;
}

interface ReviewsProps {
  reviews: Review[];
  formatDate: (date: string | Date) => string;
}

export function Reviews({ reviews, formatDate }: ReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews & Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={review.menteeImage}
                        alt={review.menteeName}
                      />
                      <AvatarFallback>
                        {review.menteeName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{review.menteeName}</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.date)}
                  </p>
                </div>
                <div className="mb-2">
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-gray-700 mb-4">{review.review}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                  asChild
                >
                  <Link href={`/sessions/${review.id}`}>
                    <Eye className="h-3 w-3" />
                    <span>View Session</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No reviews yet</p>
        )}
      </CardContent>
    </Card>
  );
}
