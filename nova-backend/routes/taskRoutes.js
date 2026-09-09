const express = require("express");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const commentRoutes = require("./commentRoutes");

const router = express.Router({ mergeParams: true });

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

// /api/projects/:projectId/tasks/:taskId/comments
router.use("/:taskId/comments", commentRoutes);

module.exports = router;
