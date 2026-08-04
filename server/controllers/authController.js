import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// =======================
// Register User
// =======================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are filled
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send a welcome email (best-effort - don't fail registration if this errors)
    sendEmail({
      to: user.email,
      subject: "Welcome to TaskFlow 👋",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <img src="cid:logo" alt="TaskFlow" width="56" height="56" style="display:block; margin-bottom: 16px;" />
          <h2 style="color:#16a34a;">Welcome to TaskFlow, ${user.name}!</h2>
          <p>Your account has been created successfully. You can now start organizing your tasks, tracking your progress, and hitting your goals.</p>
          <p style="color:#6b7280; font-size: 13px; margin-top: 24px;">If you didn't create this account, you can safely ignore this email.</p>
        </div>
      `,
    }).catch((err) => console.error("Failed to send welcome email:", err.message));

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
  console.error("REGISTER ERROR:");
  console.error(error);

  res.status(500).json({
    message: error.message,
    error,
  });
}
};

// =======================
// Login User
// =======================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    // Find user and include password (in case it's excluded by default elsewhere)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

// =======================
// Get Logged-In User Profile
// =======================

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("GET ME ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

// =======================
// Update Logged-In User Profile
// =======================

export const updateMe = async (req, res) => {
  try {
    const { name, avatar, bio, title, phone, location, notifications, language } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (title !== undefined) user.title = title;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;

    if (notifications !== undefined) {
      if (notifications.taskReminders !== undefined) {
        user.notifications.taskReminders = notifications.taskReminders;
      }
      if (notifications.emailNotifications !== undefined) {
        user.notifications.emailNotifications = notifications.emailNotifications;
      }
    }

    if (language !== undefined) user.language = language;

    await user.save();

    res.status(200).json({
      message: "Profile updated.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        title: user.title,
        phone: user.phone,
        location: user.location,
        notifications: user.notifications,
        language: user.language,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("UPDATE ME ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

// =======================
// Upload / Replace Avatar
// Expects a single file field named "avatar" (handled by multer
// in the route). Deletes the old uploaded avatar file, if any,
// to avoid orphaned files piling up on disk.
// =======================

export const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If the previous avatar was a locally uploaded file, remove it
    if (user.avatar && user.avatar.startsWith("/uploads/")) {
      const oldPath = path.join(process.cwd(), user.avatar);
      fs.unlink(oldPath, () => {}); // best-effort, ignore errors
    }

    const relativePath = `/uploads/avatars/${req.file.filename}`;
    user.avatar = relativePath;
    await user.save();

    res.status(200).json({
      message: "Avatar updated.",
      avatar: relativePath,
    });
  } catch (error) {
    console.error("UPLOAD AVATAR ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

// =======================
// Change Password
// Requires the current password to confirm identity before
// setting a new one.
// =======================

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide your current and new password.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

// =======================
// Forgot Password
// Generates a one-time reset token, emails a reset link to the
// user's real inbox. Always responds with a generic message
// (whether or not the email exists) so we don't leak which
// emails are registered.
// =======================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your email." });
    }

    const genericResponse = {
      message: "If an account with that email exists, a reset link has been sent.",
    };

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether the email exists
      return res.status(200).json(genericResponse);
    }

    // Generate a random token, store only its hash (never the raw token)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your TaskFlow password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <img src="cid:logo" alt="TaskFlow" width="56" height="56" style="display:block; margin-bottom: 16px;" />
          <h2 style="color:#16a34a;">Reset your password</h2>
          <p>We received a request to reset the password for your TaskFlow account.</p>
          <p style="margin: 24px 0;">
            <a href="${resetLink}" style="background:#22c55e; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">
              Reset Password
            </a>
          </p>
          <p style="color:#6b7280; font-size: 13px;">This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

// =======================
// Reset Password
// Verifies the token from the emailed link and sets a new password.
// =======================

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Please provide a new password." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error,
    });
  }
};