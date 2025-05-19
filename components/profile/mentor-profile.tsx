import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { type MentorProfile } from "@/types/mentor";
import { calculateProfileCompletion } from "./utils/profile-utils";
import { ProfileSidebar } from "./sections/profile-sidebar";
import { BasicInfoForm } from "./sections/basic-info-form";
import { ExperienceForm } from "./sections/experience-form";
import { EducationForm } from "./sections/education-form";
import { PricingForm } from "./sections/pricing-form";
import { AvailabilityCard } from "../dashboard/service-cards";

interface MentorProfilePageProps {
  mentorProfile: MentorProfile;
}

export function MentorProfilePage({ mentorProfile }: MentorProfilePageProps) {
  const profileCompletionPercentage = calculateProfileCompletion(mentorProfile);

  return (
    <div className="container mx-auto px-2 md:px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard/mentor">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-xl md:text-3xl font-bold">Mentor Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <ProfileSidebar
            mentorProfile={mentorProfile}
            profileCompletionPercentage={profileCompletionPercentage}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="text-xs md:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-xs md:text-sm">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs md:text-sm">
                Education
              </TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs md:text-sm">
                Pricing
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <BasicInfoForm mentorProfile={mentorProfile} />
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience">
              <ExperienceForm mentorProfile={mentorProfile} />
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education">
              <EducationForm mentorProfile={mentorProfile} />
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing">
              <PricingForm mentorProfile={mentorProfile} />
            </TabsContent>
          </Tabs>
          <div className="lg:col-span-2 mt-8">
            <AvailabilityCard />
          </div>
        </div>
      </div>
    </div>
  );
}
