import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title required" });
  }

  const task = await Task.create({
    title,
    priority: priority || "Medium",
    user: req.user.id,
  });

  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.status = "Completed";
  await task.save();

  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
