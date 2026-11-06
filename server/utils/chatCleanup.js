import Message from "../models/Message.js";
import { deleteMediaFile } from "./chatMedia.js";
import {
  emitToGroup,
  emitToUser,
  removeUserFromGroupRoom,
  closeGroupRoom,
} from "./socket.js";

// Used when a group is deleted: removes every message and its files.
export async function deleteGroupChat(groupId) {
  const withMedia = await Message.find({
    group: groupId,
    "media.filename": { $exists: true },
  }).select("media.filename");

  await Promise.all(withMedia.map((m) => deleteMediaFile(m.media.filename)));
  await Message.deleteMany({ group: groupId });

  emitToGroup(groupId, "group:deleted", { groupId: String(groupId) });
  closeGroupRoom(groupId);
}

// Used when someone leaves or is removed: cuts off their live updates.
export function kickFromGroupChat(userId, groupId) {
  emitToUser(userId, "group:removed", { groupId: String(groupId) });
  removeUserFromGroupRoom(userId, groupId);
}
