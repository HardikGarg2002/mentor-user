import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/providers/session-provider";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { APP } from "@/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP.NAME,
  description: APP.DESCRIPTION,
  keywords: [
    "mentorship",
    "career development",
    "expert mentors",
    "professional guidance",
    "skill development",
  ],
  authors: [{ name: `${APP.NAME} Team`, url: APP.BASE_URL }],
  creator: APP.NAME,
  publisher: APP.NAME,
  metadataBase: new URL(APP.BASE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP.BASE_URL,
    title: `${APP.NAME} - Connect with Expert Mentors`,
    description:
      "Connect with industry experts who can help you grow your skills and advance your career.",
    siteName: APP.NAME,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${APP.NAME} - Connect with Expert Mentors`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP.NAME} - Connect with Expert Mentors`,
    description:
      "Connect with industry experts who can help you grow your skills and advance your career.",
    images: ["/images/twitter-image.jpg"],
    creator: "@aricious",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#4F46E5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
          <div className="flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors />
          {/* </ThemeProvider> */}
        </SessionProvider>
      </body>
    </html>
  );
}
