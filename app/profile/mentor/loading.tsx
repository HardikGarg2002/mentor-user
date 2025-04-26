import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

export default function MentorProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-24 mr-4" />
        <Skeleton className="h-10 w-72" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-8 w-48 mt-4" />
                <Skeleton className="h-4 w-36 mt-2" />
                <Skeleton className="h-4 w-24 mt-2" />
              </div>

              <Skeleton className="h-[1px] w-full my-6" />

              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-5 w-28 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-5 w-36 mb-2" />
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </div>
              </div>

              <Skeleton className="h-[1px] w-full my-6" />

              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-36 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-10 w-16" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-5 w-16 mb-1" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <div className="flex flex-wrap gap-1">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
