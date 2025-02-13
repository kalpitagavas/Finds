const express = require("express");
const router = express.Router();
const { trackClicks, getClicksByVlog, getClicksByUser } = require("../controllers/affiliateClickController");
const authMiddleware = require("../middleware/AuthMiddleware");
const adminMiddleware = require("../middleware/AdminMiddleware");


// Route for tracking clicks - available to any authenticated user.
router.post("/track", authMiddleware, trackClicks);

// Analytics endpoint for clicks on a given vlog - restricted to admin only.
router.get("/vlog/:vlogId", authMiddleware, adminMiddleware, (req, res) => {
    console.log("GET /vlog/:vlogId called with ID:", req.params.vlogId);
    getClicksByVlog(req, res);
});
// Analytics endpoint for clicks for a specific user - restricted to admin only.
router.get("/user/:userId", authMiddleware, adminMiddleware, getClicksByUser);

module.exports = router;