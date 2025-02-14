const express = require("express");
const router = express.Router();
const { createVlog, getAllVlogs, getVlogById, updateVlog, deleteVlog } = require("../controllers/VlogController");
const authMiddleware = require("../middleware/AuthMiddleware");
const adminMiddleware = require("../middleware/AdminMiddleware");

// Public routes: Everyone can view vlogs
router.get("/", getAllVlogs);
router.get("/:id", getVlogById);

// Admin-only routes: Only admins can create, update, or delete vlogs
router.post("/create", authMiddleware, createVlog);
router.put("/:id", authMiddleware, adminMiddleware, updateVlog);
router.delete("/:id", authMiddleware, adminMiddleware, deleteVlog);

module.exports = router;
