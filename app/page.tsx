import Link from "next/link";
import { Button } from "@/components/ui/button";
import PopularTopics from "@/components/home-page/popular-topics";
import FeaturedMentors from "@/components/home-page/featured-mentors";
import HowItWorks from "@/components/home-page/how-it-works";
import HeroSection from "@/components/home-page/hero-section";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      <FeaturedMentors />
      <HowItWorks />
      <PopularTopics />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Become a Mentor</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Share your expertise, help others grow, and earn money on your own
            schedule.
          </p>
          <Link href="/auth/signup/become-mentor">
            <Button variant="secondary" size="lg">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
