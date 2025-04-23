import { getMentorProfile } from "@/actions/mentor-actions";
import { MentorProfilePage } from "@/components/profile/mentor-profile";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Suspense } from "react";
import { MentorProfile } from "@/types/mentor";

async function fetchMentorProfile(userId: string): Promise<MentorProfile> {
  const mentorProfile = await getMentorProfile(userId);

  if (!mentorProfile) {
    redirect("/become-mentor");
  }

  // Serialize the data to avoid date serialization issues
  return JSON.parse(JSON.stringify(mentorProfile));
}

export default async function MentorProfilePageContainer() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile/mentor");
  }

  // Check if user is a mentor
  if (session.user.role !== "mentor") {
    redirect("/dashboard");
  }

  // Get mentor profile
  const mentorProfileData = await fetchMentorProfile(session.user.id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MentorProfilePage mentorProfile={mentorProfileData} />
    </Suspense>
  );
}
