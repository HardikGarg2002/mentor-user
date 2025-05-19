"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  initialQuery = "",
  onSearch,
  className = "",
  placeholder = "Search by skill, industry, or name...",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   setQuery(initialQuery);
  // }, [initialQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/mentors?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative flex items-center ${className}`}
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pr-16"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-8"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-0"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
