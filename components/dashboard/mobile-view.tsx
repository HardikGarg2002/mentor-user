"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CalendarIcon, MessageCircleIcon, StarIcon } from "lucide-react";

export function MentorView() {
  const actions = [
    {
      label: "Book",
      icon: <CalendarIcon className="h-6 w-6" />,
      content: <div>Booking content goes here.</div>,
    },
    {
      label: "Chat",
      icon: <MessageCircleIcon className="h-6 w-6" />,
      content: <div>Chat content goes here.</div>,
    },
    {
      label: "Reviews",
      icon: <StarIcon className="h-6 w-6" />,
      content: <div>Reviews content goes here.</div>,
    },
    // Add more actions here
  ];

  return (
    <div className="w-full">
      {/* Mobile view: icons with bottom sheets */}
      <div className="flex justify-around items-center md:hidden p-2 border-t bg-white">
        {actions.map((action, i) => (
          <Sheet key={i}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center text-sm text-gray-800 hover:text-black focus:outline-none">
                {action.icon}
                <span className="mt-1">{action.label}</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{action.label}</h2>
                {action.content}
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>

      {/* Desktop view: full section component */}
      <div className="hidden md:block p-4">
        <div className="grid grid-cols-3 gap-6">
          {actions.map((action, i) => (
            <div key={i} className="p-4 border rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-gray-700">
                {action.icon}
                <h3 className="text-base font-medium">{action.label}</h3>
              </div>
              {action.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
