"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const PushNotificationContext = createContext({
  subscribe: async () => {
    console.log("context subscribe called");
  },
});

export const usePushNotifications = () => useContext(PushNotificationContext);

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log("Service worker registered");
        })
        .catch((err) => {
          console.error("Service worker registration failed", err);
          alert("Service worker registration failed: " + err);
        });
    } else {
      console.warn("Service worker or PushManager not supported");
      alert("Push notifications are not supported in this browser.");
    }
  }, []);

  const subscribe = async () => {
    console.log("subscribe function in context called");
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log("Service worker ready", registration);
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission !== "granted") {
        alert("Notifications not granted.");
        return;
      }
      if (!VAPID_PUBLIC_KEY) {
        alert("VAPID public key is missing.");
        return;
      }
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      console.log("Push subscription:", subscription);
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      console.log("Subscription sent to backend:", res.ok);
      setSubscribed(true);
      alert("Push notifications enabled!");
    } catch (err) {
      console.error("Push subscription error:", err);
      alert("Failed to subscribe for push notifications: " + err);
    }
  };

  return (
    <PushNotificationContext.Provider value={{ subscribe }}>
      {children}
    </PushNotificationContext.Provider>
  );
};
