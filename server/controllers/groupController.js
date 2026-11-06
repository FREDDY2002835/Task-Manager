import mongoose from "mongoose";
import Group from "../models/Group.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import { sendEmail } from "../utils/sendEmail.js";
import { deleteGroupChat, kickFromGroupChat } from "../utils/chatCleanup.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const MEMBER_FIELDS = "name email avatar title bio";

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

// Loads a group and checks the current user belongs to it.
// Returns { group, member } or sends the error response and returns null.
// A non-member gets 404 (not 403) so group ids can't be probed.
export async function loadGroupAsMember(req, res, groupId = req.params.id) {
  if (!isValidId(groupId)) {
    res.status(404).json({ message: "Group not found." });
    return null;
  }

  const group = await Group.findById(groupId);
  const member = group?.members.find(
    (m) => m.user.toString() === req.user.id
  );

  if (!group || !member) {
    res.status(404).json({ message: "Group not found." });
    return null;
  }

  return { group, member };
}

// Same as above but also requires the admin role.
async function loadGroupAsAdmin(req, res) {
  const result = await loadGroupAsMember(req, res);
  if (!result) return null;

  if (result.member.role !== "admin") {
    res.status(403).json({ message: "Only group admins can do that." });
    return null;
  }

  return result;
}

const isOwner = (group, userId) => group.owner.toString() === userId;

// Shapes a group for the client, with populated members and the
// current user's role.
async function serializeGroup(group, userId) {
  await group.populate("members.user", MEMBER_FIELDS);

  const me = group.members.find((m) => m.user?._id?.toString() === userId);

  return {
    _id: group._id,
    name: group.name,
    description: group.description,
    owner: group.owner,
    isOwner: isOwner(group, userId),
    myRole: me?.role || null,
    members: group.members
      .filter((m) => m.user) // skip members whose account was deleted
      .map((m) => ({
        user: m.user,
        role: m.role,
        joinedAt: m.joinedAt,
        isOwner: group.owner.toString() === m.user._id.toString(),
      })),
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
}

// =======================
// Create Group
// =======================
export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required." });
    }

    const group = await Group.create({
      name,
      description,
      owner: req.user.id,
      members: [{ user: req.user.id, role: "admin" }],
    });

    res.status(201).json(await serializeGroup(group, req.user.id));
  } catch (error) {
    console.error("CREATE GROUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// My Groups (list)
// =======================
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ "members.user": req.user.id }).sort({
      updatedAt: -1,
    });

    // One aggregate for all groups' task counts instead of 2 queries per group
    const counts = await Task.aggregate([
      { $match: { group: { $in: groups.map((g) => g._id) } } },
      {
        $group: {
          _id: "$group",
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $eq: ["$status", "Done"] }, 1, 0] } },
        },
      },
    ]);

    const countMap = new Map(counts.map((c) => [c._id.toString(), c]));

    const result = groups.map((g) => {
      const c = countMap.get(g._id.toString());
      const me = g.members.find((m) => m.user.toString() === req.user.id);

      return {
        _id: g._id,
        name: g.name,
        description: g.description,
        memberCount: g.members.length,
        myRole: me?.role,
        taskCount: c?.total || 0,
        doneCount: c?.done || 0,
        updatedAt: g.updatedAt,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("GET GROUPS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get One Group (with members)
// =======================
export const getGroup = async (req, res) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return;

    res.status(200).json(await serializeGroup(result.group, req.user.id));
  } catch (error) {
    console.error("GET GROUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Update Group (admin)
// =======================
export const updateGroup = async (req, res) => {
  try {
    const result = await loadGroupAsAdmin(req, res);
    if (!result) return;

    const { group } = result;
    const { name, description } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Group name is required." });
      }
      group.name = name;
    }
    if (description !== undefined) group.description = description;

    await group.save();

    res.status(200).json(await serializeGroup(group, req.user.id));
  } catch (error) {
    console.error("UPDATE GROUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Delete Group (owner only) - also deletes all its tasks
// =======================
export const deleteGroup = async (req, res) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return;

    if (!isOwner(result.group, req.user.id)) {
      return res
        .status(403)
        .json({ message: "Only the group owner can delete the group." });
    }

    await deleteGroupChat(result.group._id); // messages + their files
    await Task.deleteMany({ group: result.group._id });
    await Group.deleteOne({ _id: result.group._id });

    res.status(200).json({ message: "Group deleted." });
  } catch (error) {
    console.error("DELETE GROUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Add Member by email (admin)
// The person must already have a TaskFlow account.
// =======================
export const addMember = async (req, res) => {
  try {
    const result = await loadGroupAsAdmin(req, res);
    if (!result) return;

    const { group } = result;
    const email = (req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message:
          "No TaskFlow account uses that email. Ask them to sign up first.",
      });
    }

    if (group.members.some((m) => m.user.toString() === user._id.toString())) {
      return res
        .status(400)
        .json({ message: "That person is already in this group." });
    }

    group.members.push({ user: user._id, role: "member" });
    await group.save();

    // Best-effort email - never fail the request because of it
    if (user.notifications?.emailNotifications !== false) {
      sendEmail({
        to: user.email,
        subject: `You've been added to "${group.name}" on TaskFlow`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
            <img src="cid:logo" alt="TaskFlow" width="56" height="56" style="display:block; margin-bottom: 16px;" />
            <h2 style="color:#16a34a;">You're now part of ${group.name}</h2>
            <p>Hi ${user.name}, you were added to the group <b>${group.name}</b>. Log in to TaskFlow to see the group's tasks.</p>
          </div>
        `,
      }).catch((err) =>
        console.error("Failed to send group invite email:", err.message)
      );
    }

    res.status(201).json(await serializeGroup(group, req.user.id));
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Remove Member / Leave Group
// - an admin can remove anyone except the owner
// - any member can remove themselves (leave), except the owner
// =======================
export const removeMember = async (req, res) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return;

    const { group, member } = result;
    const targetId = req.params.userId;

    if (!isValidId(targetId)) {
      return res.status(404).json({ message: "Member not found." });
    }

    const isSelf = targetId === req.user.id;

    if (!isSelf && member.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only group admins can remove other members." });
    }

    if (isOwner(group, targetId)) {
      return res.status(400).json({
        message:
          "The group owner can't be removed. Delete the group instead.",
      });
    }

    const before = group.members.length;
    group.members = group.members.filter((m) => m.user.toString() !== targetId);

    if (group.members.length === before) {
      return res.status(404).json({ message: "Member not found." });
    }

    await group.save();

    // Stop sending them live chat updates
    kickFromGroupChat(targetId, group._id);

    // Their tasks stay in the group, but are no longer assigned to them
    await Task.updateMany(
      { group: group._id, assignedTo: targetId },
      { $set: { assignedTo: null } }
    );

    res.status(200).json({ message: isSelf ? "You left the group." : "Member removed." });
  } catch (error) {
    console.error("REMOVE MEMBER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Change a member's role (owner only)
// =======================
export const updateMemberRole = async (req, res) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return;

    const { group } = result;

    if (!isOwner(group, req.user.id)) {
      return res
        .status(403)
        .json({ message: "Only the group owner can change roles." });
    }

    const { role } = req.body;
    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ message: "Role must be admin or member." });
    }

    if (isOwner(group, req.params.userId)) {
      return res
        .status(400)
        .json({ message: "The owner is always an admin." });
    }

    const target = group.members.find(
      (m) => m.user.toString() === req.params.userId
    );

    if (!target) {
      return res.status(404).json({ message: "Member not found." });
    }

    target.role = role;
    await group.save();

    res.status(200).json(await serializeGroup(group, req.user.id));
  } catch (error) {
    console.error("UPDATE MEMBER ROLE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================================================
// GROUP TASKS
// Permissions:
//   view / create / update  -> any group member
//   delete                  -> the task's creator or a group admin
// ===============================================================

const TASK_POPULATE = [
  { path: "assignedTo", select: MEMBER_FIELDS },
  { path: "user", select: "name avatar" }, // creator
];

// Returns true if assignedTo is empty or belongs to a group member.
function isValidAssignee(group, assignedTo) {
  if (!assignedTo) return true;
  return group.members.some((m) => m.user.toString() === String(assignedTo));
}

// =======================
// List a group's tasks
// Supports ?status=&search=&assignedTo=me|<userId>|unassigned
// =======================
export const getGroupTasks = async (req, res) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return;

    const { status, search, assignedTo } = req.query;
    const filter = { group: result.group._id };

    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };

    if (assignedTo === "me") {
      filter.assignedTo = req.user.id;
    } else if (assignedTo === "unassigned") {
      filter.assignedTo = null;
    } else if (assignedTo && isValidId(assignedTo)) {
      filter.assignedTo = assignedTo;
    }

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate(TASK_POPULATE);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("GET GROUP TASKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Create a group task
// =======================
export const createGroupTask = async (req, res) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return;

    const { group } = result;
    const { title, description, category, priority, status, dueDate, assignedTo } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }

    if (!isValidAssignee(group, assignedTo)) {
      return res
        .status(400)
        .json({ message: "You can only assign a task to a group member." });
    }

    const task = await Task.create({
      user: req.user.id,
      group: group._id,
      assignedTo: assignedTo || null,
      title,
      description,
      category,
      priority,
      status,
      dueDate,
    });

    await ActivityLog.create({
      user: req.user.id,
      task: task._id,
      taskTitle: task.title,
      action: "created",
      details: `Created task "${task.title}" in group "${group.name}"`,
    });

    await task.populate(TASK_POPULATE);

    res.status(201).json(task);
  } catch (error) {
    console.error("CREATE GROUP TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Update a group task (any member)
// =======================
export const updateGroupTask = async (req, res) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return;

    const { group } = result;

    if (!isValidId(req.params.taskId)) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Scoped by group, so a task id from another group never matches
    const task = await Task.findOne({
      _id: req.params.taskId,
      group: group._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const { title, description, category, priority, status, dueDate, assignedTo } =
      req.body;

    if (assignedTo !== undefined && !isValidAssignee(group, assignedTo)) {
      return res
        .status(400)
        .json({ message: "You can only assign a task to a group member." });
    }

    const previousStatus = task.status;
    const previousDueDate = task.dueDate ? task.dueDate.getTime() : null;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    // A new due date means a fresh reminder should fire
    const newDueDate = task.dueDate ? task.dueDate.getTime() : null;
    if (newDueDate !== previousDueDate) task.reminderSent = false;

    await task.save();

    const statusChanged = status !== undefined && status !== previousStatus;

    await ActivityLog.create({
      user: req.user.id,
      task: task._id,
      taskTitle: task.title,
      action: statusChanged ? "statusChanged" : "updated",
      details: statusChanged
        ? `Changed status of "${task.title}" from ${previousStatus} to ${status}`
        : `Updated task "${task.title}" in group "${group.name}"`,
    });

    await task.populate(TASK_POPULATE);

    res.status(200).json(task);
  } catch (error) {
    console.error("UPDATE GROUP TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Delete a group task (creator or group admin)
// =======================
export const deleteGroupTask = async (req, res) => {
  try {
    const result = await loadGroupAsMember(req, res);
    if (!result) return;

    const { group, member } = result;

    if (!isValidId(req.params.taskId)) {
      return res.status(404).json({ message: "Task not found." });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      group: group._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const isCreator = task.user.toString() === req.user.id;

    if (!isCreator && member.role !== "admin") {
      return res.status(403).json({
        message: "Only the task's creator or a group admin can delete it.",
      });
    }

    await task.deleteOne();

    await ActivityLog.create({
      user: req.user.id,
      task: null,
      taskTitle: task.title,
      action: "deleted",
      details: `Deleted task "${task.title}" from group "${group.name}"`,
    });

    res.status(200).json({ message: "Task deleted." });
  } catch (error) {
    console.error("DELETE GROUP TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
