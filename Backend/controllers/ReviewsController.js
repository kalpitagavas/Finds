const Review = require('../models/Reviews');
const User = require('../models/User'); // Import the User model to get the username

// GET /api/reviews/:productId
const getReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    // Fetch reviews and populate the 'user' field with 'name' (username)
    const reviews = await Review.find({ productId }).populate("user", "name");

    res.status(200).json(reviews);  // Return the reviews with populated user data
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error retrieving reviews" });
  }
};


// POST /api/reviews/:productId
const createReview = async (req, res) => {
  const { productId, userId, username, text, emojis } = req.body;

  console.log('Received Data:', { productId, userId, username, text }); // Log the incoming data

  // Check if all required fields are provided
  if (!productId || !userId || !username || !text) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const review = new Review({
      productId,
      user: userId,
      username,  // Store the username
      text,
      emojis,
    });

    await review.save();
    res.status(201).json(review);  // Return the created review as the response
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getReviews,
  createReview,
};
