import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();   

app.use(express.json()); 

import taskRoutes from "./routes/taskRoutes.js";

app.use("/api/tasks", taskRoutes);
import dashboardRoutes from "./routes/dashboardroutes.js";

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

app.get("/", (req, res) => {
  res.send("Team Task Manager API is running 🚀");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
