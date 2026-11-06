import express from "express";
import {
  requireMember,
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/chatController.js";
import { uploadChatMedia } from "../middleware/chatUpload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mounted at /api/groups, so these become /api/groups/:id/messages...
router.use(protect);

router.get("/:id/messages", requireMember, getMessages);

// Order matters: log in -> must be a member -> only THEN accept the upload
router.post("/:id/messages", requireMember, uploadChatMedia, sendMessage);

router.delete("/:id/messages/:messageId", requireMember, deleteMessage);

export default router;
