const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      owner: req.userId,
      members: [{ user: req.userId, role: "owner" }],
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project", error: err.message });
  }
};

// GET /api/projects  (all projects the logged-in user belongs to)
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ "members.user": req.userId })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
};

// GET /api/projects/:projectId
const getProjectById = async (req, res) => {
  // req.project already loaded + membership verified by requireProjectMember
  await req.project.populate("owner", "name email avatar");
  await req.project.populate("members.user", "name email avatar");
  res.json(req.project);
};

// PATCH /api/projects/:projectId
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (name !== undefined) req.project.name = name;
    if (description !== undefined) req.project.description = description;
    await req.project.save();
    res.json(req.project);
  } catch (err) {
    res.status(500).json({ message: "Failed to update project", error: err.message });
  }
};

// DELETE /api/projects/:projectId  (owner only)
const deleteProject = async (req, res) => {
  try {
    await Task.deleteMany({ project: req.project._id });
    await req.project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
};

// POST /api/projects/:projectId/members  { email }  (owner only)
const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user found with that email" });

    const alreadyMember = req.project.members.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (alreadyMember) return res.status(409).json({ message: "User is already a member" });

    req.project.members.push({ user: user._id, role: "member" });
    await req.project.save();
    await req.project.populate("members.user", "name email avatar");
    res.status(201).json(req.project);
  } catch (err) {
    res.status(500).json({ message: "Failed to add member", error: err.message });
  }
};

// DELETE /api/projects/:projectId/members/:userId  (owner only)
const removeMember = async (req, res) => {
  try {
    if (req.params.userId === req.project.owner.toString()) {
      return res.status(400).json({ message: "Cannot remove the project owner" });
    }
    req.project.members = req.project.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await req.project.save();
    res.json(req.project);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove member", error: err.message });
  }
};

// GET /api/projects/:projectId/progress
const getProjectProgress = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.project._id });
    const total = tasks.length;
    const counts = { todo: 0, "in-progress": 0, done: 0 };
    tasks.forEach((t) => counts[t.status]++);
    const percentComplete = total ? Math.round((counts.done / total) * 100) : 0;

    res.json({ total, counts, percentComplete });
  } catch (err) {
    res.status(500).json({ message: "Failed to compute progress", error: err.message });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectProgress,
};
