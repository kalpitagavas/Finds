// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { getReviews, createReview } = require("../controllers/ReviewsController");

// Retrieve reviews for a given product
router.get("/:productId", getReviews);

// Create a new review for a product (with optional emojis)
router.post("/:productId", createReview);

module.exports = router;
