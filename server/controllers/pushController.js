import PushSubscription from "../models/PushSubscription.js";
import { getVapidPublicKey as getKey } from "../utils/webPush.js";

// =======================
// Get the public VAPID key
// The frontend needs this to create a push subscription in the browser.
// =======================
export const getVapidPublicKey = (req, res) => {
  try {
    res.status(200).json({ publicKey: getKey() });
  } catch (error) {
    console.error("GET VAPID KEY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Save a push subscription for the logged-in user
// Called once the browser grants notification permission and creates
// a PushSubscription object. Upserts by endpoint so re-subscribing
// (e.g. after clearing site data) doesn't create duplicates.
// =======================
export const subscribe = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid subscription object." });
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { user: req.user.id, endpoint, keys },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Subscribed to push notifications." });
  } catch (error) {
    console.error("PUSH SUBSCRIBE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Remove a push subscription (e.g. user disables reminders on this device)
// =======================
export const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ message: "endpoint is required." });
    }

    await PushSubscription.deleteOne({ endpoint, user: req.user.id });

    res.status(200).json({ message: "Unsubscribed." });
  } catch (error) {
    console.error("PUSH UNSUBSCRIBE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
