"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, MessageCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
// import { FaUserTie, FaUsers } from "react-icons/fa6";

interface Role {
  id: string;
  name: string;
  description: string[];
  stats: string;
  icon: React.ReactNode;
  colors: {
    ring: string;
    gradientFrom: string;
    gradientTo: string;
    text: string;
  };
}

const roleData: Role[] = [
  {
    id: "mentee",
    name: "Mentee",
    description: [
      "Showcase your expertise and projects",
      "Connect with potential clients",
      "Secure and seamless communication",
      "Monetize your skills effectively",
    ],
    stats: "5,000+ registered developers",
    icon: <Users size={24} className="text-4xl md:text-5xl text-blue-600" />,
    colors: {
      ring: "ring-blue-500",
      gradientFrom: "from-blue-100",
      gradientTo: "to-white",
      text: "text-blue-600",
    },
  },
  {
    id: "mentor",
    name: "Mentor",
    description: [
      "Find top-rated developers",
      "Chat with experts for custom services",
      "Secure transactions and payment protection",
      "24/7 support for seamless experience",
    ],
    stats: "10,000+ satisfied clients",
    icon: <Users size={24} className="text-4xl md:text-5xl text-purple-600" />,
    colors: {
      ring: "ring-purple-500",
      gradientFrom: "from-purple-100",
      gradientTo: "to-white",
      text: "text-purple-600",
    },
  },
];

export default function RoleList() {
  const router = useRouter();

  const handleRoleSelect = async (roleId: string) => {
    const path =
      roleId === "mentee" ? `/auth/signup/user` : `/auth/signup/become-mentor`;
    router.push(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-16">
      {roleData.map((role) => {
        return (
          <div
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className={cn(
              "p-6 md:py-8 md:px-12 cursor-pointer transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 rounded-2xl border",
              `bg-gradient-to-br ${role.colors.gradientFrom} ${role.colors.gradientTo}`,
              `shadow:bg-gradient-to-br shadow:${role.colors.gradientFrom} shadow:${role.colors.gradientTo}`
            )}
          >
            <div className="text-center">
              <div
                className={cn(
                  "w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8 transform",
                  role.id === "mentee" ? "rotate-6" : "-rotate-6",
                  `bg-gradient-to-br ${role.colors.gradientFrom} ${role.colors.gradientTo}`
                )}
              >
                {role.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900">
                {role.name}
              </h3>
              <div className="space-y-3 md:space-y-4 text-left mb-6 md:mb-8">
                {role.description.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center text-gray-700 text-sm md:text-base"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 md:mr-3 " />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs md:text-sm text-gray-500">
                <MessageCircle />
                <span>{role.stats}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
