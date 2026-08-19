import { precacheAndRoute } from "workbox-precaching";

// vite-plugin-pwa injects the list of files to precache here at build time.
precacheAndRoute(self.__WB_MANIFEST);

// Fired when the backend sends a push notification (via web-push) to
// this device - this is what makes the reminder show up even if the
// TaskFlow tab/app isn't open.
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "TaskFlow", body: event.data.text() };
  }

  const title = payload.title || "TaskFlow";
  const options = {
    body: payload.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: payload.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Fired when the user taps the notification - focuses an existing
// TaskFlow tab if one is open, otherwise opens a new one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
