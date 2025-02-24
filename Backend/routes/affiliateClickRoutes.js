const express = require("express");
const router = express.Router();
const { trackClicks,getAllClicks } = require("../controllers/affiliateClickController");  // Make sure the controller path is correct
const authMiddleware = require("../middleware/AuthMiddleware");
const adminMiddleware = require("../middleware/AdminMiddleware");

// Track affiliate click when user clicks on a product link
router.get('/affiliate/click/:productId', trackClicks);

// Admin route to get all affiliate clicks
router.get('/admin/affiliate-clicks', getAllClicks);

module.exports = router;
