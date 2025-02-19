const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser } = require("../controllers/UserController");

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get user profile (requires authentication middleware)
router.get("/profile", getUserProfile);

// Update user profile (requires authentication middleware)
router.put("/profile", updateUserProfile);

// Logout user (requires authentication middleware)
router.post("/logout", logoutUser);

module.exports = router;
