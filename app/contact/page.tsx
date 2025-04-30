import React from "react";
import { Card } from "@/components/ui/card";
import {
  Mail,
  MessageSquare,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Contact Us | ARicious",
  description: "Get in touch with ARicious. We'd love to hear from you!",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            We're here to help! Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Get in Touch */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-gray-700 mb-6">
                  We're here to help! Whether you have a question, suggestion or
                  just want to say hello, we'd love to hear from you.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-700">contact@aricious.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MessageSquare className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold">Send Us a Message</h3>
                      <p className="text-gray-700">
                        Got a question or comment? Drop us an email or reach out
                        through social media!
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Social Media</h2>
                <p className="text-gray-700 mb-6">
                  Level up your knowledge! We're dropping gems on our socials:
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Mentor wisdom and expert hacks",
                    "Product updates and industry trends",
                    "Valuable insights on career and life",
                    "Plus, stay updated on our latest news and product updates!",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex space-x-4 mt-8">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Send Us a Message
            </h2>

            <Card className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Message subject"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Your message"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Have Questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Check out our FAQ section for answers to commonly asked questions.
          </p>
          <Link href="/faq">
            <Button variant="outline" size="lg">
              View FAQ
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
