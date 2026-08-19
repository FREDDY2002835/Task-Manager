import express from "express";
import {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
} from "../controllers/pushController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/vapid-public-key", protect, getVapidPublicKey);
router.post("/subscribe", protect, subscribe);
router.post("/unsubscribe", protect, unsubscribe);

export default router;
