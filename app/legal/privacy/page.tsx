import React from "react";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy | ARicious",
  description: "Learn about how ARicious protects and handles your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl max-w-2xl mx-auto">
            We value your privacy and are committed to protecting your personal
            data.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="p-8 max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
              <p>
                At ARicious ("we", "our", or "us"), we respect your privacy and
                are committed to protecting your personal data. This privacy
                policy will inform you about how we look after your personal
                data when you visit our website and tell you about your privacy
                rights and how the law protects you.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                2. The Data We Collect
              </h2>
              <p>
                We may collect, use, store and transfer different kinds of
                personal data about you which we have grouped together as
                follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Identity Data</strong> includes first name, last name,
                  username or similar identifier.
                </li>
                <li>
                  <strong>Contact Data</strong> includes email address and
                  telephone numbers.
                </li>
                <li>
                  <strong>Technical Data</strong> includes internet protocol
                  (IP) address, your login data, browser type and version, time
                  zone setting and location, browser plug-in types and versions,
                  operating system and platform, and other technology on the
                  devices you use to access this website.
                </li>
                <li>
                  <strong>Profile Data</strong> includes your username and
                  password, your interests, preferences, feedback, and survey
                  responses.
                </li>
                <li>
                  <strong>Usage Data</strong> includes information about how you
                  use our website, products, and services.
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                3. How We Use Your Data
              </h2>
              <p>
                We will only use your personal data when the law allows us to.
                Most commonly, we will use your personal data in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Where we need to perform the contract we are about to enter
                  into or have entered into with you.
                </li>
                <li>
                  Where it is necessary for our legitimate interests (or those
                  of a third party) and your interests and fundamental rights do
                  not override those interests.
                </li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used, or
                accessed in an unauthorized way, altered, or disclosed. In
                addition, we limit access to your personal data to those
                employees, agents, contractors, and other third parties who have
                a business need to know.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                5. Data Retention
              </h2>
              <p>
                We will only retain your personal data for as long as reasonably
                necessary to fulfill the purposes we collected it for, including
                for the purposes of satisfying any legal, regulatory, tax,
                accounting, or reporting requirements.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                6. Your Legal Rights
              </h2>
              <p>
                Under certain circumstances, you have rights under data
                protection laws in relation to your personal data, including the
                right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track the
                activity on our Service and we hold certain information. Cookies
                are files with a small amount of data which may include an
                anonymous unique identifier.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                8. Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page. We will let you know via email and/or a prominent
                notice on our Service, prior to the change becoming effective
                and update the "last updated" date at the top of this Privacy
                Policy.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p>
                <strong>Email:</strong> privacy@aricious.com
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
