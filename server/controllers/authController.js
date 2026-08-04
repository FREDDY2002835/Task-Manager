import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

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