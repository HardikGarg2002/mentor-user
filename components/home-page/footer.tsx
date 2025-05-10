import Link from "next/link";
import { Facebook, X, Instagram, Linkedin, Youtube } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold text-primary mb-4 block"
            >
              ARicious
            </Link>
            <p className="text-gray-600 mb-4">
              Connect with industry experts who can help you grow your skills
              and advance your career.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://youtube.com/@aricious?si=mNJEzv4JhNB2GqtI"
                className="text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-6 w-6" />
                <span className="sr-only">Youtube</span>
              </a>
              <a
                href="https://www.instagram.com/aricious__?igsh=MW9rcGw5Z254NXcyOA=="
                className="text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Find Mentors
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup/become-mentor"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div id="newsletter">
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} ARicious. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
