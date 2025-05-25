self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  self.registration.showNotification(data.title || "Notification", {
    body: data.body || "",
    data: { url: data.url || "/" },
    icon: "/favicon.ico",
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
