import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const inputSearchParams = await searchParams;
  const query =
    typeof inputSearchParams.q === "string" ? inputSearchParams.q : "";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>

      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar initialQuery={query} placeholder="Search mentors..." />
      </div>

      <div className="max-w-2xl mx-auto">
        <SearchResults query={query} />
      </div>
    </div>
  );
}
