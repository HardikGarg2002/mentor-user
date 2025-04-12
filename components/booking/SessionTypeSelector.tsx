"use client";

import { MessageCircle, Phone, Video } from "lucide-react";

export type SessionType = "chat" | "video" | "call";

type Props = {
  selectedType: SessionType;
  pricing: { chat: number; video: number; call: number };
  setSelectedType: (type: SessionType) => void;
};

export default function SessionTypeSelector({
  selectedType,
  pricing,
  setSelectedType,
}: Props) {
  const updateType = (type: SessionType) => {
    setSelectedType(type);
  };
  const iconClassName = "h-5 w-5 mr-3 text-primary";

  const types = [
    {
      key: "chat" as SessionType,
      icon: <MessageCircle className={iconClassName} />,
      label: "Chat",
      pricing: pricing["chat"],
    },
    {
      key: "video" as SessionType,
      icon: <Video className={iconClassName} />,
      label: "Video",
      pricing: pricing["video"],
    },
    {
      key: "call" as SessionType,
      icon: <Phone className={iconClassName} />,
      label: "Call",
      pricing: pricing["call"],
    },
  ];

  return (
    <div className="space-y-2">
      {types.map(({ key, icon, label, pricing }) => (
        <div
          key={key}
          onClick={() => updateType(key)}
          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
            selectedType === key ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center">
            {icon} <span>{label} Session</span>
          </div>
          <span className="font-semibold">${pricing}/hr</span>
        </div>
      ))}
    </div>
  );
}
