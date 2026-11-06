import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Group from "../models/Group.js";
import { readMessageContent, serializeMessage } from "./chatController.js";
import { deleteMediaFile } from "../utils/chatMedia.js";
import { emitToUser } from "../utils/socket.js";

// Private (1-to-1) chat. A private message is a Message with a
// `recipient` and no group. Conversations are always looked up from the
// LOGGED-IN user's point of view, so nobody can ever read a conversation
// they aren't part of.

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// All messages between two people, in both directions
const between = (a, b) => ({
  group: null,
  $or: [
    { sender: a, recipient: b },
    { sender: b, recipient: a },
  ],
});

// Route middleware: the other person must be a real, different user.
export const requirePartner = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!isValidId(userId)) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ message: "You can't message yourself." });
    }

    const partner = await User.findById(userId).select("name avatar");

    if (!partner) {
      return res.status(404).json({ message: "User not found." });
    }

    req.partner = partner;
    next();
  } catch (error) {
    console.error("DM PARTNER CHECK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Route middleware for SENDING: you can only start a private chat with
// someone you share at least one group with (stops random strangers being
// messaged). Runs before the upload so refused senders can't store files.
// Reading an existing conversation is never blocked by this.
export const requireSharedGroup = async (req, res, next) => {
  try {
    const shared = await Group.exists({
      "members.user": {
        $all: [new mongoose.Types.ObjectId(req.user.id), req.partner._id],
      },
    });

    if (!shared) {
      return res.status(403).json({
        message: "You can only message people you share a group with.",
      });
    }

    next();
  } catch (error) {
    console.error("DM SHARED GROUP CHECK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Read a conversation (newest page; ?before=<id> for older). Opening the
// latest page marks the other person's messages as read.
// =======================
export const getConversation = async (req, res) => {
  try {
    const me = req.user.id;
    const partnerId = req.partner._id;
    const limit = Math.min(parseInt(req.query.limit) || 30, 50);
    const filter = between(me, partnerId);

    if (req.query.before && isValidId(req.query.before)) {
      filter._id = { $lt: req.query.before };
    }

    const found = await Message.find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate("sender", "name avatar");

    const hasMore = found.length > limit;
    const page = found.slice(0, limit).reverse();

    if (!req.query.before) {
      await markConversationRead(me, partnerId);
    }

    res.status(200).json({ messages: page.map(serializeMessage), hasMore });
  } catch (error) {
    console.error("GET CONVERSATION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

async function markConversationRead(me, partnerId) {
  const result = await Message.updateMany(
    { sender: partnerId, recipient: me, readAt: null, group: null },
    { $set: { readAt: new Date() } }
  );

  // Tell the user's other open devices to clear their unread badge
  if (result.modifiedCount > 0) {
    emitToUser(me, "dm:read", { userId: String(partnerId) });
  }
}

// =======================
// Send a private message: text, and/or one photo, video or voice note.
// =======================
export const sendDm = async (req, res) => {
  try {
    const content = await readMessageContent(req, res);
    if (!content) return; // already answered with a 400

    const message = await Message.create({
      sender: req.user.id,
      recipient: req.partner._id,
      type: content.type,
      text: content.text,
      media: content.media,
    });

    await message.populate("sender", "name avatar");

    const payload = serializeMessage(message);

    // Both people get it live (this also reaches the sender's other devices)
    emitToUser(req.user.id, "dm:new", payload);
    emitToUser(req.partner._id, "dm:new", payload);

    res.status(201).json(payload);
  } catch (error) {
    if (req.file) await deleteMediaFile(req.file.filename);
    console.error("SEND DM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Delete one of YOUR OWN private messages
// =======================
export const deleteDm = async (req, res) => {
  try {
    if (!isValidId(req.params.messageId)) {
      return res.status(404).json({ message: "Message not found." });
    }

    const message = await Message.findOne({
      _id: req.params.messageId,
      ...between(req.user.id, req.partner._id),
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.sender.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages." });
    }

    await message.deleteOne();
    await deleteMediaFile(message.media?.filename);

    const payload = { _id: String(message._id) };
    emitToUser(req.user.id, "dm:deleted", payload);
    emitToUser(req.partner._id, "dm:deleted", payload);

    res.status(200).json({ message: "Message deleted." });
  } catch (error) {
    console.error("DELETE DM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Mark a conversation as read (used when a message arrives while the
// conversation is already open)
// =======================
export const markRead = async (req, res) => {
  try {
    await markConversationRead(req.user.id, req.partner._id);
    res.status(200).json({ message: "Marked as read." });
  } catch (error) {
    console.error("MARK READ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Unread counts per person: { "<userId>": 2, ... }
// =======================
export const getUnread = async (req, res) => {
  try {
    const rows = await Message.aggregate([
      {
        $match: {
          recipient: new mongoose.Types.ObjectId(req.user.id),
          readAt: null,
          group: null,
        },
      },
      { $group: { _id: "$sender", count: { $sum: 1 } } },
    ]);

    res
      .status(200)
      .json(Object.fromEntries(rows.map((r) => [String(r._id), r.count])));
  } catch (error) {
    console.error("GET UNREAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
