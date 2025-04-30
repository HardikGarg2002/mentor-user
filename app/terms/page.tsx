import React from "react";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service | ARicious",
  description: "Read our Terms of Service agreement for using ARicious.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our
            service.
          </p>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="p-8 max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                1. Agreement to Terms
              </h2>
              <p>
                These Terms of Service constitute a legally binding agreement
                between you and ARicious regarding your use of our website and
                mentorship services.
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by
                these Terms. If you disagree with any part of the terms, then
                you may not access the Service.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                2. Intellectual Property
              </h2>
              <p>
                Our Service and its original content, features, and
                functionality are and will remain the exclusive property of
                ARicious and its licensors. The Service is protected by
                copyright, trademark, and other laws.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. Failure to
                do so constitutes a breach of the Terms, which may result in
                immediate termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use
                to access the Service and for any activities or actions under
                your password.
              </p>
              <p>
                You agree not to disclose your password to any third party. You
                must notify us immediately upon becoming aware of any breach of
                security or unauthorized use of your account.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                4. Content and Conduct
              </h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise
                make available certain information, text, graphics, videos, or
                other material. You are responsible for the content that you
                post on or through the Service, including its legality,
                reliability, and appropriateness.
              </p>
              <p>
                By posting content on or through the Service, you represent and
                warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The content is yours (you own it) or you have the right to use
                  it and grant us the rights and license as provided in these
                  Terms.
                </li>
                <li>
                  The posting of your content on or through the Service does not
                  violate the privacy rights, publicity rights, copyrights,
                  contract rights or any other rights of any person.
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                5. Mentorship Services
              </h2>
              <p>
                Mentors on our platform are independent contractors and not
                employees of ARicious. We do not guarantee the quality,
                accuracy, or appropriateness of advice given by mentors.
              </p>
              <p>By using our mentorship services, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Treat mentors with respect and professionalism</li>
                <li>Attend scheduled sessions on time</li>
                <li>Provide payment as agreed upon</li>
                <li>
                  Use the mentorship for legitimate personal or professional
                  development purposes
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                6. Payments and Refunds
              </h2>
              <p>
                Payment for mentorship services must be made in advance of
                sessions. Our payment process is secure and encrypted.
              </p>
              <p>Our refund policy for mentorship sessions is as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  If a mentor fails to attend a scheduled session, you will
                  receive a full refund or credit for a future session.
                </li>
                <li>
                  If you cancel more than 24 hours before a scheduled session,
                  you will receive a full refund.
                </li>
                <li>
                  If you cancel less than 24 hours before a scheduled session,
                  refunds are at the discretion of the mentor.
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may simply
                discontinue using the Service.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                8. Limitation of Liability
              </h2>
              <p>
                In no event shall ARicious, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                9. Changes to Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material we
                will try to provide at least 30 days' notice prior to any new
                terms taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our Service after those revisions
                become effective, you agree to be bound by the revised terms. If
                you do not agree to the new terms, please stop using the
                Service.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <p>
                <strong>Email:</strong> legal@aricious.com
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
