import Task from "../models/Task.js";

// @desc Create a task
// @route POST /api/tasks
// @access Private
export const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    user: req.user._id,
  });

  res.status(201).json(task);
};

// @desc Get logged-in user's tasks
// @route GET /api/tasks
// @access Private
export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Authorization check
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.status = req.body.status || task.status;
  task.dueDate = req.body.dueDate || task.dueDate;

  const updatedTask = await task.save();
  res.json(updatedTask);
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.json({ message: "Task removed" });
};
