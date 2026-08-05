import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Kept even after the task itself is deleted, so history still
    // reads correctly.
    taskTitle: {
      type: String,
      required: true,
    },

    // Null once the task has been deleted.
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    action: {
      type: String,
      enum: ["created", "updated", "statusChanged", "deleted"],
      required: true,
    },

    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
