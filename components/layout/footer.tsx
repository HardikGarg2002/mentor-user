import Link from "next/link";
import { Facebook, X, Instagram, Linkedin, Youtube } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import {
  SOCIAL_LINKS,
  LEGAL_LINKS,
  SUPPORT_LINKS,
  RESOURCE_LINKS,
} from "@/config/constants";

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
                href={SOCIAL_LINKS.YOUTUBE}
                className="text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-6 w-6" />
                <span className="sr-only">Youtube</span>
              </a>
              <a
                href={SOCIAL_LINKS.INSTAGRAM}
                className="text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href={SOCIAL_LINKS.LINKEDIN}
                className="text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href={SOCIAL_LINKS.TWITTER}
                className="text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="sr-only">X</span>
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
                  href={SUPPORT_LINKS.CONTACT}
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
                  href={RESOURCE_LINKS.BLOG}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href={SUPPORT_LINKS.FAQ}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href={LEGAL_LINKS.PRIVACY}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={LEGAL_LINKS.TERMS}
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
