import { type MentorProfile } from "@/types/mentor";

/**
 * Calculate profile completion percentage based on filled sections
 * @param mentorProfile The mentor profile to calculate completion for
 * @returns A number between 0 and 100 representing completion percentage
 */
export function calculateProfileCompletion(
  mentorProfile: MentorProfile
): number {
  let completed = 0;
  let total = 0;

  // Check basic info
  if (mentorProfile.title) {
    completed++;
  }
  total++;

  if (mentorProfile.about && mentorProfile.about.length >= 50) {
    completed++;
  }
  total++;

  if (mentorProfile.specialties.length > 0) {
    completed++;
  }
  total++;

  // Check experience
  if (mentorProfile.experience.length > 0) {
    completed++;
  }
  total++;

  // Check education
  if (mentorProfile.education.length > 0) {
    completed++;
  }
  total++;

  // Check pricing
  if (mentorProfile.pricing.chat > 0) {
    completed++;
  }
  total++;

  if (mentorProfile.pricing.video > 0) {
    completed++;
  }
  total++;

  if (mentorProfile.pricing.call > 0) {
    completed++;
  }
  total++;

  return Math.round((completed / total) * 100);
}
