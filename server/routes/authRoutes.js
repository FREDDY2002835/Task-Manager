import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  uploadUserAvatar,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/me/avatar", protect, uploadAvatar.single("avatar"), uploadUserAvatar);
router.put("/change-password", protect, changePassword);

export default router;
