"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { searchMentors } from "@/actions/search-actions";
import type { MentorProfile } from "@/types/mentor";
import { FallbackImage } from "@/components/ui/fallback-image";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const mentors = await searchMentors(query);
        setResults(mentors);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query.trim()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No mentors found for {query}</p>
          <p className="text-sm text-gray-400 mt-2">
            Try a different search term or browse all mentors
          </p>
          <Link href="/mentors">
            <Button variant="outline" className="mt-4">
              Browse All Mentors
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((mentor) => (
        <Card key={mentor.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <Link
              href={`/mentors/${mentor.id}`}
              className="flex items-center space-x-4"
            >
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                {mentor.image ? (
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <FallbackImage className="w-16 h-16 rounded-full" text="" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium truncate">{mentor.name}</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm">{mentor.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 truncate">{mentor.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mentor.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {mentor.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
