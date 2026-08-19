import { getVapidPublicKey, subscribeToPush, unsubscribeFromPush } from "../services/api";

export function isPushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

// Web Push requires the VAPID public key as a Uint8Array, but the
// backend gives it to us as a base64url string - this converts it.
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Requests notification permission (if needed), subscribes this
// browser/device to push, and saves the subscription on the backend
// so the reminder job can find it later.
export async function enablePushNotifications() {
  if (!isPushSupported()) {
    throw new Error("Push notifications aren't supported in this browser.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const { data } = await getVapidPublicKey();
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });
  }

  await subscribeToPush(subscription.toJSON());

  return subscription;
}

// Removes this browser/device's subscription, both locally and on
// the backend, so it stops receiving reminders.
export async function disablePushNotifications() {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await unsubscribeFromPush(subscription.endpoint);
    await subscription.unsubscribe();
  }
}
