const Task = require("../models/Task");
const Comment = require("../models/Comment");

// GET /api/projects/:projectId/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.project._id })
      .populate("assignee", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

// POST /api/projects/:projectId/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority, assignee, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const task = await Task.create({
      title,
      description,
      priority,
      assignee: assignee || null,
      dueDate: dueDate || null,
      project: req.project._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
};

// PATCH /api/projects/:projectId/tasks/:taskId
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, project: req.project._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const editable = ["title", "description", "status", "priority", "assignee", "dueDate"];
    const prevStatus = task.status;

    editable.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });
    await task.save();

    // Auto-log status changes to the activity feed
    if (req.body.status && req.body.status !== prevStatus) {
      await Comment.create({
        task: task._id,
        author: req.userId,
        text: `moved this task from "${prevStatus}" to "${req.body.status}"`,
        type: "activity",
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
};

// DELETE /api/projects/:projectId/tasks/:taskId
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      project: req.project._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    await Comment.deleteMany({ task: task._id });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
