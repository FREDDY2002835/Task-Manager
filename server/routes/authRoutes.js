import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  uploadUserAvatar,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/me/avatar", protect, uploadAvatar.single("avatar"), uploadUserAvatar);
router.put("/change-password", protect, changePassword);

export default router;
