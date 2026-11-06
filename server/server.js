import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import dmRoutes from "./routes/dmRoutes.js";
import { serveMedia } from "./controllers/chatController.js";
import { initSocket } from "./utils/socket.js";
import { startReminderJob } from "./jobs/reminderJob.js";

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded avatar images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/push", pushRoutes);
// Chat files: public route, but only reachable with a signed, expiring link
app.get("/api/media/chat/:filename", serveMedia);

app.use("/api/groups", groupRoutes);
app.use("/api/groups", chatRoutes);
app.use("/api/dm", dmRoutes); // private 1-to-1 chat

app.get("/", (req, res) => {
  res.send("🚀 TaskFlow API is running...");
});

const PORT = process.env.PORT || 5000;

// Connect to the database first, then start listening.
// connectDB() already calls process.exit(1) on failure, so we only
// reach app.listen when the DB is actually up.
connectDB().then(() => {
  // Socket.IO (live chat) shares the same HTTP server and port as the API
  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startReminderJob();
  });
});