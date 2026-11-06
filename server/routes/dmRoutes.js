import express from "express";
import {
  requirePartner,
  requireSharedGroup,
  getConversation,
  sendDm,
  deleteDm,
  markRead,
  getUnread,
} from "../controllers/dmController.js";
import { uploadChatMedia } from "../middleware/chatUpload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mounted at /api/dm
router.use(protect);

// Must come before "/:userId/..." so "unread" isn't mistaken for a user id
router.get("/unread", getUnread);

router.get("/:userId/messages", requirePartner, getConversation);

// Order matters: real user -> shares a group with you -> only THEN accept the upload
router.post(
  "/:userId/messages",
  requirePartner,
  requireSharedGroup,
  uploadChatMedia,
  sendDm
);

router.delete("/:userId/messages/:messageId", requirePartner, deleteDm);
router.post("/:userId/read", requirePartner, markRead);

export default router;
