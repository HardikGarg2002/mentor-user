import { NewsletterForm } from "./newsletter-form";

interface NewsletterSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NewsletterSection({
  title = "Subscribe to Our Newsletter",
  description = "Get the latest updates, tips, and resources delivered straight to your inbox.",
  className = "",
}: NewsletterSectionProps) {
  return (
    <section className={`py-12 bg-gray-50 ${className}`} id="newsletter">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
