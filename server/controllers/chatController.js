import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import Task from "../models/Task.js";
import { loadGroupAsMember } from "./groupController.js";
import {
  classifyMime,
  deleteMediaFile,
  filePathFor,
  isValidFilename,
  signedMediaPath,
  verifySignature,
} from "../utils/chatMedia.js";
import { emitToGroup } from "../utils/socket.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const MAX_TEXT = 2000;

// Shapes a message for the client. File links are signed here, and only
// ever sent to people who passed the membership check.
export function serializeMessage(msg) {
  const sender = msg.sender?._id
    ? { _id: msg.sender._id, name: msg.sender.name, avatar: msg.sender.avatar }
    : { _id: null, name: "Deleted user", avatar: "" };

  return {
    _id: msg._id,
    group: msg.group || null,
    recipient: msg.recipient || null,
    type: msg.type,
    text: msg.text,
    sender,
    task: msg.task || null,
    taskTitle: msg.taskTitle || "",
    media: msg.media?.filename
      ? {
          url: signedMediaPath(msg.media.filename),
          mimeType: msg.media.mimeType,
          size: msg.media.size,
          duration: msg.media.duration || null,
          originalName: msg.media.originalName,
        }
      : null,
    createdAt: msg.createdAt,
  };
}

// Route middleware: must be a member BEFORE we accept any upload.
export const requireMember = async (req, res, next) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return; // response already sent

    req.group = result.group;
    req.member = result.member;
    next();
  } catch (error) {
    console.error("CHAT MEMBER CHECK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get messages (newest page first; use ?before=<messageId> for older ones)
// Returns them oldest -> newest, ready to display.
// =======================
export const getMessages = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 30, 50);
    const filter = { group: req.group._id };

    if (req.query.before && isValidId(req.query.before)) {
      filter._id = { $lt: req.query.before };
    }

    const found = await Message.find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate("sender", "name avatar");

    const hasMore = found.length > limit;
    const page = found.slice(0, limit).reverse();

    res.status(200).json({ messages: page.map(serializeMessage), hasMore });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Validates the text and/or file of a multipart message (used by group
// chat AND private chat). Returns { type, text, media }, or - after
// deleting the upload and sending a 400 - returns null.
export async function readMessageContent(req, res) {
  const file = req.file;
  const reject = async (message) => {
    if (file) await deleteMediaFile(file.filename);
    res.status(400).json({ message });
    return null;
  };

  const text = (req.body.text || "").trim();

  if (!file && !text) return reject("Write a message or attach a file.");

  if (text.length > MAX_TEXT) {
    return reject(`Messages can be up to ${MAX_TEXT} characters.`);
  }

  if (!file) return { type: "text", text, media: undefined };

  const rule = classifyMime(file.mimetype);

  if (file.size > rule.maxBytes) {
    const mb = Math.round(rule.maxBytes / (1024 * 1024));
    const label =
      rule.kind === "image" ? "Photos" : rule.kind === "video" ? "Videos" : "Voice notes";
    return reject(`${label} can be up to ${mb} MB.`);
  }

  const media = {
    filename: file.filename,
    originalName: path.basename(file.originalname || "").slice(0, 120),
    mimeType: rule.mime,
    size: file.size,
  };

  if (rule.kind === "audio") {
    const seconds = Math.round(Number(req.body.duration));
    if (Number.isFinite(seconds) && seconds > 0) {
      media.duration = Math.min(seconds, 60 * 60);
    }
  }

  return { type: rule.kind, text, media };
}

// =======================
// Send a message: text, and/or one file (photo, video, voice note).
// multipart/form-data: text, task, duration, media (file)
// =======================
export const sendMessage = async (req, res) => {
  const file = req.file;
  const discardFile = () => (file ? deleteMediaFile(file.filename) : null);

  try {
    const content = await readMessageContent(req, res);
    if (!content) return; // already answered with a 400

    const { type, text, media } = content;

    // ---- optional task tag: must be a task of THIS group ----
    let task = null;
    let taskTitle = "";

    if (req.body.task) {
      const found = isValidId(req.body.task)
        ? await Task.findOne({ _id: req.body.task, group: req.group._id }).select("title")
        : null;

      if (!found) {
        await discardFile();
        return res.status(400).json({ message: "That task isn't in this group." });
      }

      task = found._id;
      taskTitle = found.title;
    }

    const message = await Message.create({
      group: req.group._id,
      sender: req.user.id,
      type,
      text,
      media,
      task,
      taskTitle,
    });

    await message.populate("sender", "name avatar");

    const payload = serializeMessage(message);

    // Everyone in the group (including the sender's other devices)
    // gets it instantly. The sender's own client de-duplicates by _id.
    emitToGroup(req.group._id, "message:new", payload);

    res.status(201).json(payload);
  } catch (error) {
    await discardFile();
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Delete a message (its sender, or a group admin)
// =======================
export const deleteMessage = async (req, res) => {
  try {
    if (!isValidId(req.params.messageId)) {
      return res.status(404).json({ message: "Message not found." });
    }

    const message = await Message.findOne({
      _id: req.params.messageId,
      group: req.group._id,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    const isSender = message.sender?.toString() === req.user.id;

    if (!isSender && req.member.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only the sender or a group admin can delete a message." });
    }

    await message.deleteOne();
    await deleteMediaFile(message.media?.filename);

    emitToGroup(req.group._id, "message:deleted", {
      _id: String(message._id),
      group: String(req.group._id),
    });

    res.status(200).json({ message: "Message deleted." });
  } catch (error) {
    console.error("DELETE MESSAGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Serve a chat file. PUBLIC route, protected by the signed, expiring link
// (browsers can't attach a login header to <img>/<video>/<audio> tags).
// sendFile handles Range requests, so video seeking works.
// =======================
export const serveMedia = (req, res) => {
  const { filename } = req.params;
  const { exp, sig } = req.query;

  if (!isValidFilename(filename) || !verifySignature(filename, exp, sig)) {
    return res.status(403).json({ message: "This link is invalid or has expired." });
  }

  const absolute = filePathFor(filename);

  if (!fs.existsSync(absolute)) {
    return res.status(404).json({ message: "File not found." });
  }

  res.set("X-Content-Type-Options", "nosniff");
  res.set("Cache-Control", "private, max-age=3600");
  res.set("Content-Disposition", "inline");

  res.sendFile(absolute, (err) => {
    if (err && !res.headersSent) res.status(err.status || 404).end();
  });
};
