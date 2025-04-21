import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/providers/session-provider";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/home-page/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mentor Platform",
  description: "Connect with expert mentors in your field",
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
