import React from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "About Us | ARicious",
  description:
    "Learn more about ARicious and our mission to help you level up.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            At ARicious we're on a mission to help you unlock your potential and
            crush your goals.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-8">
              At ARicious we're on a mission to help you unlock your potential
              and crush your goals. Whether you're navigating career twists,
              life turns, or just figuring things out, we're here to guide you
              with wisdom, support, and a dash of real talk.
            </p>

            <h2 className="text-2xl font-bold mb-4">Our Vibes</h2>
            <ul className="space-y-3 mb-8">
              {[
                "Authentic mentorship",
                "Real-life advice",
                "Community-driven growth",
                "No judgments, just support",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <Card className="p-6 bg-primary/5 border-primary/20 mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Let's Grow Together
              </h3>
              <p className="text-gray-700 mb-4">
                Join our community and start leveling up!
              </p>
              <Link href="/auth/signup">
                <Button>Join Now</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-2">Mission</h2>
              <h3 className="text-xl font-semibold text-primary mb-4">
                Level Up Life
              </h3>
              <p className="text-gray-700">
                We're on a mission to hook you up with the guidance, resources,
                and squad you need to crush your goals and live your best life.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-2">Vision</h2>
              <h3 className="text-xl font-semibold text-primary mb-4">
                Futureproof Your Dreams
              </h3>
              <p className="text-gray-700">
                We envision a world where everyone has the support and tools to
                achieve their wildest dreams. We're building a community that's
                all about growth, connection, and making your mark.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What We Offer
            </h2>
            <ul className="space-y-6">
              {[
                {
                  title: "Mentorship",
                  description:
                    "Connect with experienced mentors who can provide guidance on various topics.",
                },
                {
                  title: "Ask Without Hesitation",
                  description:
                    "Ask questions without fear of judgment or hesitation, and get answers from mentors who understand your concerns.",
                },
                {
                  title: "Save Time and Effort",
                  description:
                    "Get direct answers from mentors, saving you time and effort in researching and trying to figure things out on your own.",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Level Up?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community today and start your journey towards achieving
            your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/mentors">
              <Button variant="secondary" size="lg">
                Find a Mentor
              </Button>
            </Link>
            <Link href="/auth/signup/become-mentor">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                Become a Mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
