import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import { startReminderJob } from "./jobs/reminderJob.js";

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded avatar images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/push", pushRoutes);

app.get("/", (req, res) => {
  res.send("🚀 TaskFlow API is running...");
});

const PORT = process.env.PORT || 5000;

// Connect to the database first, then start listening.
// connectDB() already calls process.exit(1) on failure, so we only
// reach app.listen when the DB is actually up.
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startReminderJob();
  });
});