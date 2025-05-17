import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog | ARicious",
  description: "Stories, insights, and updates from ARicious.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">ARicious Blog</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Insights, stories, and updates from our community.
          </p>
        </div>
      </section>

      {/* Featured Blog Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-60 md:h-auto">
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-primary">
                  <span className="text-4xl font-light">ARicious Blog</span>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  The Birth of ARicious- Be Greedy To ASK!
                </h2>
                <p className="text-gray-600 mb-6">
                  I still remember the frustration of having crazy questions
                  with no one to turn to. My family and friends would either
                  brush me off or not understand what I was going through. So,
                  I'd find myself scouring Google and YouTube for answers, only
                  to end up with more questions than solutions.
                </p>
                {/* <Link href="/blog/birth-of-aricious">
                  <Button variant="outline">Read More</Button>
                </Link> */}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                I still remember the frustration of having crazy questions with
                no one to turn to. My family and friends would either brush me
                off or not understand what I was going through. So, I'd find
                myself scouring Google and YouTube for answers, only to end up
                with more questions than solutions.
              </p>

              <p>
                The comments section would be filled with vague responses or
                unhelpful advice. I'd think to myself, "Why can't I just talk to
                someone who gets it?"
              </p>

              <p>
                That's when the idea for ARicious was born. I wanted to create a
                space where people could ask their toughest questions, share
                their doubts, and get real guidance from people who understand.
              </p>

              <h3 className="text-xl font-bold mt-8 mb-4">
                A Platform for Real Talk
              </h3>
              <p>
                ARicious is more than just a Q&A site - it's a community of
                people who believe in the power of open and honest discussions.
                We're here to provide a safe space for you to ask your
                questions, share your concerns, and get guidance from people who
                care.
              </p>

              <h3 className="text-xl font-bold mt-8 mb-4">Join the Journey</h3>
              <p>
                We're excited to have you join our community and embark on this
                journey with us. Share your story, seek guidance, and connect
                with others who understand what you're going through. Together,
                we can create a ripple effect of positivity and support that
                inspires others to do the same.
              </p>

              <h3 className="text-xl font-bold mt-8 mb-4">Conclusion</h3>
              <p>
                ARicious is more than just a platform - it's a movement. It's a
                community of like-minded individuals who believe in the power of
                connection, support, and growth. We're honored to have you join
                us on this journey, and we look forward to seeing the incredible
                things you'll achieve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5 my-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Join our community today and start your journey towards achieving
            your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/mentors">
              <Button>Find a Mentor</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
