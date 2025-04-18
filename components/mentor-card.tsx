import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MentorListItem } from "@/types";

type MentorCardProps = {
  mentor: MentorListItem;
};

const getPlaceholderImage = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;
};

export function MentorCard({ mentor }: MentorCardProps) {
  console.log("mentor id in mentor card", mentor.userId);
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={mentor.image || getPlaceholderImage(mentor.name)}
            alt={mentor.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-1">{mentor.name}</h3>
          <p className="text-gray-600 mb-3">{mentor.title}</p>

          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 font-medium">{mentor.rating}</span>
            <span className="text-gray-500 ml-1">
              ({mentor.reviewCount} reviews)
            </span>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {mentor.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500">Chat</p>
              <p className="font-semibold">${mentor.pricing.chat}/hr</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500">Video</p>
              <p className="font-semibold">${mentor.pricing.video}/hr</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500">Call</p>
              <p className="font-semibold">${mentor.pricing.call}/hr</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={`/mentors/${mentor.userId}`} className="w-full">
          <Button className="w-full">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
