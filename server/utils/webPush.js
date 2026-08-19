import webpush from "web-push";

let configured = false;

function ensureConfigured() {
  if (configured) return;

  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error(
      "VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY are missing from .env - push notifications can't work without them."
    );
  }

  webpush.setVapidDetails(
    VAPID_SUBJECT || "mailto:admin@example.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );

  configured = true;
}

// Sends a push notification to one subscription. Returns an object
// telling the caller whether the subscription is dead (410 Gone / 404)
// so it can be removed from the database.
export async function sendPushNotification(subscription, payload) {
  ensureConfigured();

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload)
    );
    return { ok: true };
  } catch (error) {
    const statusCode = error?.statusCode;
    const isDead = statusCode === 404 || statusCode === 410;
    console.error("PUSH SEND ERROR:", statusCode, error.message);
    return { ok: false, isDead };
  }
}

export function getVapidPublicKey() {
  const { VAPID_PUBLIC_KEY } = process.env;
  if (!VAPID_PUBLIC_KEY) {
    throw new Error("VAPID_PUBLIC_KEY is missing from .env.");
  }
  return VAPID_PUBLIC_KEY;
}
