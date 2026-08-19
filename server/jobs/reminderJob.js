import cron from "node-cron";
import Task from "../models/Task.js";
import User from "../models/User.js";
import PushSubscription from "../models/PushSubscription.js";
import { sendPushNotification } from "../utils/webPush.js";

// Finds tasks that are due, not done, and haven't had a reminder sent
// yet, and pushes a real notification to every device the task's
// owner has subscribed on. Runs every minute.
async function checkDueTasks() {
  try {
    const now = new Date();

    const dueTasks = await Task.find({
      dueDate: { $lte: now },
      status: { $ne: "Done" },
      reminderSent: false,
    }).populate("user", "notifications");

    if (dueTasks.length === 0) return;

    for (const task of dueTasks) {
      const user = task.user;

      // Always mark as sent even if we skip sending, so we don't
      // keep re-checking a task the user has reminders turned off for.
      task.reminderSent = true;
      await task.save();

      if (!user || user.notifications?.taskReminders === false) {
        continue;
      }

      const subscriptions = await PushSubscription.find({ user: user._id });

      if (subscriptions.length === 0) continue;

      const payload = {
        title: "Task due: " + task.title,
        body: task.description
          ? task.description.slice(0, 120)
          : "This task is due now.",
        url: "/tasks",
      };

      for (const sub of subscriptions) {
        const result = await sendPushNotification(sub, payload);
        if (!result.ok && result.isDead) {
          // Subscription is no longer valid (browser data cleared,
          // uninstalled, etc.) - remove it so we stop trying.
          await PushSubscription.deleteOne({ _id: sub._id });
        }
      }
    }
  } catch (error) {
    console.error("REMINDER JOB ERROR:", error);
  }
}

export function startReminderJob() {
  // Every minute
  cron.schedule("* * * * *", checkDueTasks);
  console.log("⏰ Task reminder job scheduled (runs every minute)");
}
