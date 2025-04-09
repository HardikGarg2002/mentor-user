import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMentors } from "@/lib/mentors";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const getPlaceholderImage = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;
};

export default async function MentorsList({ searchParams }: PageProps) {
  const page =
    typeof searchParams.page === "string"
      ? Number.parseInt(searchParams.page)
      : 1;
  const specialties =
    typeof searchParams.specialties === "string"
      ? [searchParams.specialties]
      : Array.isArray(searchParams.specialties)
      ? searchParams.specialties
      : undefined;
  const minPrice =
    typeof searchParams.minPrice === "string"
      ? Number.parseInt(searchParams.minPrice)
      : undefined;
  const maxPrice =
    typeof searchParams.maxPrice === "string"
      ? Number.parseInt(searchParams.maxPrice)
      : undefined;
  const minRating =
    typeof searchParams.minRating === "string"
      ? Number.parseFloat(searchParams.minRating)
      : undefined;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const { mentors, totalPages } = await getMentors({
    page,
    specialties,
    minPrice,
    maxPrice,
    minRating,
    search,
  });

  if (mentors.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No mentors found</h2>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or search criteria
        </p>
        <Link href="/mentors">
          <Button>Clear Filters</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Showing {mentors.length} mentors</p>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={`/mentors?page=${page - 1}`}>
              <Button variant="outline" size="sm">
                Previous
              </Button>
            </Link>
          )}
          {page < totalPages && (
            <Link href={`/mentors?page=${page + 1}`}>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </Link>
          )}
        </div>
      </div>

      {mentors.map((mentor) => (
        <Card key={mentor.id} className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Image
                src={mentor.image || getPlaceholderImage(mentor.name)}
                alt={mentor.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">{mentor.name}</h2>
              <p className="text-gray-600 mb-2">{mentor.title}</p>

              <div className="flex items-center mb-3">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-medium">
                  {mentor.rating.toFixed(1)}
                </span>
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

              <p className="text-gray-700 line-clamp-2 mb-4">{mentor.about}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
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

              <Link href={`/mentors/${mentor.userId}`}>
                <Button className="w-full">View Profile</Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Link key={pageNum} href={`/mentors?page=${pageNum}`}>
            <Button
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              className="w-10 h-10"
            >
              {pageNum}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
