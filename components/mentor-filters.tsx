"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";

// Common specialties for filtering
const SPECIALTIES = [
  "React",
  "Node.js",
  "Python",
  "Data Science",
  "Machine Learning",
  "UX Design",
  "Product Management",
  "Marketing",
  "Career Advice",
  "Leadership",
];

export function MentorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "200"),
  ]);
  const [rating, setRating] = useState(
    Number.parseInt(searchParams.get("minRating") || "0")
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    searchParams.getAll("specialties")
  );

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    } else {
      setSelectedSpecialties(
        selectedSpecialties.filter((s) => s !== specialty)
      );
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 200) params.set("maxPrice", priceRange[1].toString());
    if (rating > 0) params.set("minRating", rating.toString());

    selectedSpecialties.forEach((specialty) => {
      params.append("specialties", specialty);
    });

    router.push(`/mentors?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setPriceRange([0, 200]);
    setRating(0);
    setSelectedSpecialties([]);
    router.push("/mentors");
  };

  return (
    <div className="space-y-6 sticky top-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="Search mentors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Specialties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {SPECIALTIES.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={`specialty-${specialty}`}
                  checked={selectedSpecialties.includes(specialty)}
                  onCheckedChange={(checked) =>
                    handleSpecialtyChange(specialty, checked === true)
                  }
                />
                <Label htmlFor={`specialty-${specialty}`}>{specialty}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            value={priceRange}
            min={0}
            max={200}
            step={10}
            onValueChange={setPriceRange}
            className="mb-6"
          />
          <div className="flex items-center justify-between">
            <p>₹{priceRange[0]}</p>
            <p>₹{priceRange[1]}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <svg
                  className={`h-6 w-6 ${
                    star <= rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
