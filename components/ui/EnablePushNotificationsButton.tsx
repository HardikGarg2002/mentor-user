"use client";
import React, { useState } from "react";
import { usePushNotifications } from "../layout/PushNotificationProvider";

export const EnablePushNotificationsButton: React.FC = () => {
  const { subscribe } = usePushNotifications();
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setMessage("Push notifications are not supported in this browser.");
      return;
    }
    if (Notification.permission === "denied") {
      setMessage(
        "You have blocked notifications for this site. To enable them, please go to your browser's site settings, allow notifications, and then refresh this page."
      );
      return;
    }
    if (Notification.permission === "granted") {
      setMessage("Notifications are already enabled!");
      return;
    }
    setMessage(null);
    await subscribe();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Enable Push Notifications
      </button>
      {message && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {message}
        </div>
      )}
    </div>
  );
};
