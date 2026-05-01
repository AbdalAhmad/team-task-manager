import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE PROJECT
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Only Admin can create project" });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    res.json(project);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ✅ ADD THIS — GET PROJECTS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// ADD MEMBER TO PROJECT
router.post("/:projectId/add-member", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Only Admin can add members" });
    }

    const { userId } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // avoid duplicate members
    if (project.members.includes(userId)) {
      return res.status(400).json({ msg: "User already a member" });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;