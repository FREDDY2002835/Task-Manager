import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  getProductivityStats,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All task routes require a logged-in user
router.use(protect);

router.get("/stats", getTaskStats); // must come before "/:id"
router.get("/stats/productivity", getProductivityStats); // must come before "/:id"
router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
