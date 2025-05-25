import webpush from "web-push";

// Replace with your VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

webpush.setVapidDetails(
  "mailto:hardikgarg3085@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// For demo: import the in-memory subscriptions array from the API route
import { subscriptions } from "../app/api/notifications/subscribe/route";

async function sendDemoNotification() {
  const payload = JSON.stringify({
    title: "Session Reminder",
    body: "Your session starts in 1 hour!",
    url: "/dashboard",
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      console.log("Notification sent");
    } catch (err) {
      console.error("Failed to send notification", err);
    }
  }
}

sendDemoNotification();
