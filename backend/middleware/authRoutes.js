import authMiddleware from "../middleware/authMiddleware.js";

// test protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json(req.user);
});
