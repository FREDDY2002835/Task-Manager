import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Group from "../models/Group.js";

let io = null;

// Attaches Socket.IO to the HTTP server. Every connection must present the
// same JWT the REST API uses, and can only join the rooms of groups it
// actually belongs to.
export function initSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: "*" } });

  io.use((socket, next) => {
    try {
      const decoded = jwt.verify(socket.handshake.auth?.token, process.env.JWT_SECRET);
      socket.userId = String(decoded.id);
      next();
    } catch {
      next(new Error("Not authorized"));
    }
  });

  io.on("connection", (socket) => {
    // Personal room - lets the server reach this user on any device
    socket.join(`user:${socket.userId}`);

    socket.on("group:join", async (groupId, ack) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(groupId)) return ack?.({ ok: false });

        const isMember = await Group.exists({
          _id: groupId,
          "members.user": socket.userId,
        });

        if (!isMember) return ack?.({ ok: false });

        socket.join(`group:${groupId}`);
        ack?.({ ok: true });
      } catch {
        ack?.({ ok: false });
      }
    });

    socket.on("group:leave", (groupId) => {
      socket.leave(`group:${groupId}`);
    });
  });

  return io;
}

export const emitToGroup = (groupId, event, payload) =>
  io?.to(`group:${groupId}`).emit(event, payload);

export const emitToUser = (userId, event, payload) =>
  io?.to(`user:${userId}`).emit(event, payload);

// Stops a removed member from receiving any more of the group's messages
export const removeUserFromGroupRoom = (userId, groupId) =>
  io?.in(`user:${userId}`).socketsLeave(`group:${groupId}`);

export const closeGroupRoom = (groupId) =>
  io?.in(`group:${groupId}`).socketsLeave(`group:${groupId}`);
