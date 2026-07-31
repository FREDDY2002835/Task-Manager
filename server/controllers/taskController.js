import Task from "../models/Task.js";

// =======================
// Create Task
// =======================
export const createTask = async (req, res) => {
  try {
    const { title, description, category, priority, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      category,
      priority,
      status,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR:");
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

// =======================
// Get All Tasks (for logged-in user)
// Supports ?search=&status=Pending|In Progress|Done
// =======================
export const getTasks = async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = { user: req.user.id };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:");
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

// =======================
// Get Single Task
// =======================
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("GET TASK ERROR:");
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

// =======================
// Update Task
// =======================
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const { title, description, category, priority, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error("UPDATE TASK ERROR:");
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

// =======================
// Delete Task
// =======================
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted." });
  } catch (error) {
    console.error("DELETE TASK ERROR:");
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

// =======================
// Stats (for Dashboard)
// Returns total / completed / pending counts, matching the
// "Total Tasks / Completed / Pending" cards on the frontend.
// =======================
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [total, completed, pending, inProgress] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: "Done" }),
      Task.countDocuments({ user: userId, status: "Pending" }),
      Task.countDocuments({ user: userId, status: "In Progress" }),
    ]);

    res.status(200).json({
      total,
      completed,
      pending,
      inProgress,
    });
  } catch (error) {
    console.error("GET TASK STATS ERROR:");
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};

// =======================
// Productivity Stats (for Profile page)
// All numbers are computed directly from the user's real tasks -
// nothing here is hardcoded.
// =======================
export const getProductivityStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [
      total,
      completedTotal,
      tasksThisWeek,
      completedThisWeek,
      tasksThisMonth,
      completedThisMonth,
    ] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: "Done" }),
      Task.countDocuments({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
      Task.countDocuments({
        user: userId,
        status: "Done",
        updatedAt: { $gte: sevenDaysAgo },
      }),
      Task.countDocuments({ user: userId, createdAt: { $gte: thirtyDaysAgo } }),
      Task.countDocuments({
        user: userId,
        status: "Done",
        updatedAt: { $gte: thirtyDaysAgo },
      }),
    ]);

    // Guard against divide-by-zero when a user has no tasks yet in a window
    const weeklyGoalPercent =
      tasksThisWeek > 0
        ? Math.round((completedThisWeek / tasksThisWeek) * 100)
        : 0;

    const monthlyProgressPercent =
      tasksThisMonth > 0
        ? Math.round((completedThisMonth / tasksThisMonth) * 100)
        : 0;

    const productivityScore =
      total > 0 ? Math.round((completedTotal / total) * 100) : 0;

    res.status(200).json({
      weeklyGoalPercent,
      monthlyProgressPercent,
      completedThisWeek,
      productivityScore,
    });
  } catch (error) {
    console.error("GET PRODUCTIVITY STATS ERROR:");
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
};
