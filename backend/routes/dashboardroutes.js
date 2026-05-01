import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";

const router = express.Router();

// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     res.json({ msg: "Dashboard route working" });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });

// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const total = await Task.countDocuments();

//     res.json({ total });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Total tasks
    const total = await Task.countDocuments();

    // Completed tasks
    const completed = await Task.countDocuments({
      status: "Done"
    });

    // Pending tasks (Todo + In Progress)
    const pending = await Task.countDocuments({
      status: { $in: ["Todo", "In Progress"] }
    });

    // Overdue tasks (past due date and not completed)
    const overdue = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" }
    });

    // Final response
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