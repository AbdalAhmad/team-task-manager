import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE TASK (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Only Admin can create tasks" });
    }

    const { title, project, assignedTo, dueDate } = req.body;

    if (!title || !project || !assignedTo || !dueDate) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const task = await Task.create(req.body);
    res.json(task);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// UPDATE TASK STATUS
router.put("/:taskId/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // ✅ Only assigned user OR admin
    if (
      req.user.role !== "Admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    task.status = status;
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Task.countDocuments({
      assignedTo: userId
    });

    const completed = await Task.countDocuments({
      assignedTo: userId,
      status: "Done"
    });

    const pending = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Done" }
    });

    const overdue = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" }
    });

    res.json({
      total,
      completed,
      pending,
      overdue
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;