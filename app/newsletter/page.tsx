import { NewsletterSection } from "@/components/newsletter/newsletter-section";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Newsletter</h1>
          <p className="text-lg text-center max-w-3xl mx-auto mb-12">
            Stay up to date with the latest news, resources, and insights from
            MentorMatch. Our newsletter delivers valuable content straight to
            your inbox.
          </p>
        </div>
      </div>

      <NewsletterSection
        title="Join Our Community"
        description="Subscribe to our newsletter to receive exclusive tips, resources, and special offers."
      />
    </div>
  );
}
