const Project = require("../models/Project");

// Attaches req.project and checks the logged-in user is a member.
// Use on routes that include :projectId.
const requireProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const isMember = project.members.some(
      (m) => m.user.toString() === req.userId
    );
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }
    req.project = project;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error checking project access" });
  }
};

// Use after requireProjectMember when the action should be owner-only
// (e.g. deleting a project, removing a member).
const requireProjectOwner = (req, res, next) => {
  if (req.project.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "Only the project owner can do this" });
  }
  next();
};

module.exports = { requireProjectMember, requireProjectOwner };
