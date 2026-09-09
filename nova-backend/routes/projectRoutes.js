const express = require("express");
const {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectProgress,
} = require("../controllers/projectController");
const { requireProjectMember, requireProjectOwner } = require("../middleware/projectAccess");
const { protect } = require("../middleware/auth");
const taskRoutes = require("./taskRoutes");

const router = express.Router();

// Every route in this file (and the task/comment routers mounted below it)
// requires a valid access token.
router.use(protect);

router.get("/", getMyProjects);
router.post("/", createProject);

// Everything below needs the user to be a member of :projectId
router.use("/:projectId", requireProjectMember);

router.get("/:projectId", getProjectById);
router.patch("/:projectId", updateProject);
router.delete("/:projectId", requireProjectOwner, deleteProject);

router.get("/:projectId/progress", getProjectProgress);

router.post("/:projectId/members", requireProjectOwner, addMember);
router.delete("/:projectId/members/:userId", requireProjectOwner, removeMember);

// /api/projects/:projectId/tasks/...
router.use("/:projectId/tasks", taskRoutes);

module.exports = router;
