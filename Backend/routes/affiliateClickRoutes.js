const express = require("express");
const router = express.Router();
const { trackClicks,getAllClicks } = require("../controllers/affiliateClickController");  // Make sure the controller path is correct
const authMiddleware = require("../middleware/AuthMiddleware");
const adminMiddleware = require("../middleware/AdminMiddleware");
// Route for tracking clicks - available to any authenticated user.
router.post("/track-click", authMiddleware, trackClicks);
router.get("/clicks", authMiddleware, adminMiddleware, getAllClicks); 
module.exports = router;
