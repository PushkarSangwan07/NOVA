const Comment = require("../models/Comment");
const Task = require("../models/Task");

// GET /api/projects/:projectId/tasks/:taskId/comments
const getComments = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, project: req.project._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comments = await Comment.find({ task: task._id })
      .populate("author", "name email avatar")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments", error: err.message });
  }
};

// POST /api/projects/:projectId/tasks/:taskId/comments
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const task = await Task.findOne({ _id: req.params.taskId, project: req.project._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = await Comment.create({
      task: task._id,
      author: req.userId,
      text,
      type: "comment",
    });
    await comment.populate("author", "name email avatar");
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment", error: err.message });
  }
};

module.exports = { getComments, addComment };
