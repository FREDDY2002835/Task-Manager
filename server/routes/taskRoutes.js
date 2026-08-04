import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  getProductivityStats,
  getAnalyticsStats,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All task routes require a logged-in user
router.use(protect);

// Specific "/stats/*" routes must come before the generic "/:id" route
router.get("/stats", getTaskStats);
router.get("/stats/productivity", getProductivityStats);
router.get("/stats/analytics", getAnalyticsStats);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
