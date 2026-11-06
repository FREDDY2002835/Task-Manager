import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Group messages have a group. Private (1-to-1) messages have a
    // recipient instead and group stays null.
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      required: function () {
        return !this.recipient;
      },
    },

    // Private messages only: who the message is for
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Private messages only: when the recipient opened it (null = unread)
    readAt: {
      type: Date,
      default: null,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // "text" = no attachment. The others describe the attached file.
    type: {
      type: String,
      enum: ["text", "image", "video", "audio"],
      default: "text",
    },

    // The message body, or the caption when a file is attached.
    text: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    // Present only when a file is attached.
    media: {
      filename: String, // random name on disk (never the user's filename)
      originalName: String,
      mimeType: String,
      size: Number, // bytes
      duration: Number, // seconds, voice notes only
    },

    // Optional: the group task this message is about. The title is
    // copied so the label still reads correctly if the task is deleted.
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    taskTitle: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Newest-first paging inside one group
messageSchema.index({ group: 1, _id: -1 });
// Private conversations + unread counts
messageSchema.index({ sender: 1, recipient: 1, _id: -1 });
messageSchema.index({ recipient: 1, readAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
