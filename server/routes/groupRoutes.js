import express from "express";
import {
  createGroup,
  getMyGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  updateMemberRole,
  getGroupTasks,
  createGroupTask,
  updateGroupTask,
  deleteGroupTask,
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All group routes require a logged-in user
router.use(protect);

// Groups
router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroup);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

// Members
router.post("/:id/members", addMember);
router.put("/:id/members/:userId", updateMemberRole);
router.delete("/:id/members/:userId", removeMember);

// Group tasks
router.get("/:id/tasks", getGroupTasks);
router.post("/:id/tasks", createGroupTask);
router.put("/:id/tasks/:taskId", updateGroupTask);
router.delete("/:id/tasks/:taskId", deleteGroupTask);

export default router;
