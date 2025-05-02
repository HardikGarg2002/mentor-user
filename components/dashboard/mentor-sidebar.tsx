"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  MessageSquare,
  IndianRupee,
} from "lucide-react";

export function MentorSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard/mentor",
      icon: LayoutDashboard,
    },
    {
      name: "Availability",
      href: "/dashboard/mentor/availability",
      icon: Calendar,
    },
    {
      name: "Messages",
      href: "/dashboard/mentor/chats",
      icon: MessageSquare,
    },
    {
      name: "Sessions",
      href: "/dashboard/mentor/sessions",
      icon: Users,
    },
    {
      name: "Earnings",
      href: "/dashboard/mentor/earnings",
      icon: IndianRupee,
    },
    {
      name: "Settings",
      href: "/dashboard/mentor/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 border-r h-screen sticky top-0 hidden md:block">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Mentor Dashboard</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
