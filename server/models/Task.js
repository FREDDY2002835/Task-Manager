import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Set only for group tasks. Personal tasks leave this null, which
    // is what keeps them out of group views (and vice versa).
    // For group tasks, "user" above is the person who created the task.
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      index: true,
    },

    // Group tasks only: the member responsible for the task.
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // e.g. "Development", "UI/UX" - shown as a tag on the task card
    category: {
      type: String,
      trim: true,
      default: "General",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Done"],
      default: "Pending",
    },

    dueDate: {
      type: Date,
    },

    // Tracks whether the due-date reminder push notification has
    // already been sent for this task, so the reminder job doesn't
    // send it twice. Reset to false whenever dueDate changes.
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
