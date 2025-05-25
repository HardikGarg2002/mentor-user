"use client";
import { PushNotificationProvider } from "@/components/layout/PushNotificationProvider";
import { usePushNotifications } from "@/components/layout/PushNotificationProvider";

function TestButton() {
  const { subscribe } = usePushNotifications();
  return (
    <button
      onClick={() => {
        console.log("Button clicked");
        subscribe();
      }}
    >
      Test Push
    </button>
  );
}

export default function PushTestPage() {
  return (
    <PushNotificationProvider>
      <TestButton />
    </PushNotificationProvider>
  );
}
