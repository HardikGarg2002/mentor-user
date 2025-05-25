import { PushNotificationProvider } from "./PushNotificationProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PushNotificationProvider>
      {/* ... existing layout code ... */}
      {children}
    </PushNotificationProvider>
  );
}
