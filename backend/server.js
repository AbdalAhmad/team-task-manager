import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();   // ✅ FIRST create app

app.use(express.json()); // ✅ middleware

import taskRoutes from "./routes/taskRoutes.js";

app.use("/api/tasks", taskRoutes);
import dashboardRoutes from "./routes/dashboardroutes.js";

app.use("/api/dashboard", dashboardRoutes);
// ✅ THEN use routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// ✅ DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});