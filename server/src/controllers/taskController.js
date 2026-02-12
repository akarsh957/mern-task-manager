import Task from "../models/Task.js";

/**
 * Get flat task list (optional)
 */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/**
 * Get tree-structured tasks
 */
export const getTaskTree = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).lean();

    const map = {};
    const roots = [];

    // Initialize map
    tasks.forEach(task => {
      map[task._id] = { ...task, children: [] };
    });

    // Build tree
    tasks.forEach(task => {
      if (task.parentId && map[task.parentId]) {
        map[task.parentId].children.push(map[task._id]);
      } else {
        // If no parent or parent not found (orphan), treat as root
        roots.push(map[task._id]);
      }
    });

    res.json(roots);
  } catch (err) {
    console.error("Task tree error:", err);
    res.status(500).json({ message: "Failed to fetch task tree" });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Task creation failed" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
};
