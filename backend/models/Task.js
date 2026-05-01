import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo"
  },

  dueDate: Date

}, { timestamps: true });

export default mongoose.model("Task", taskSchema);