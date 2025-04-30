import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ | ARicious",
  description:
    "Frequently asked questions about ARicious and our mentorship platform.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How does the mentorship platform work?",
      answer:
        "Our platform connects mentees with experienced mentors via call, chat, or video call. Simply browse our mentor directory, select a mentor who fits your needs, and schedule a session.",
    },
    {
      question: "Who can become a mentor?",
      answer:
        "Anyone with relevant skills and experience can become a mentor on our platform. We welcome mentors from diverse backgrounds and industries.",
    },
    {
      question: "How long are mentorship sessions?",
      answer:
        "Our minimum session duration is 30 minutes, ensuring you get valuable insights and guidance from your mentor.",
    },
    {
      question: "How much does it cost to connect with a mentor?",
      answer:
        "Our pricing is competitive and transparent. You can browse our mentor directory to see the rates for each mentor.",
    },
    {
      question: "What if I'm not satisfied with my mentorship session?",
      answer:
        "We're all about transparency here. Since you get to choose your mentor based on their detailed profiles, reviews, and skills, we expect a great match. That said, if you're not satisfied with your session, we encourage you to provide feedback to your mentor or reach out to our support team. We'll work with you to resolve any issues, but please note that we don't have a refund policy due to the personalized nature of our mentorship sessions.",
    },
    {
      question: "What if my mentor doesn't show up for our scheduled session?",
      answer:
        "We take no-shows seriously. If your mentor fails to join the session without prior notice, you can request a refund. Just send us an email with proof of payment, and we'll process your refund promptly.",
    },
    {
      question: "How do you keep it real on the platform?",
      answer:
        "We've got a community team that's always checking in to make sure everything runs smoothly. We also have a rating system so you can see what others think of your mentor.",
    },
    {
      question: "How do I know if a mentor is legit?",
      answer:
        "We've got you covered! Our mentors are verified based on their experience and skills. You can also check out their profiles, read reviews, and see their ratings.",
    },
    {
      question: "Can I ask my mentor for feedback on my portfolio or project?",
      answer:
        "Totally! Our mentors are here to help you grow. You can share your work and get constructive feedback to take your skills to the next level.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Find answers to common questions about our mentorship platform.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="border rounded-lg px-6 py-2"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            If you couldn't find the answer to your question, feel free to reach
            out to our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-primary/5 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-gray-700">
              Find the perfect mentor to help you achieve your goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/mentors">
                <Button>Browse Mentors</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
