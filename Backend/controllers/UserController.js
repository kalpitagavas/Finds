const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Register a new user.
 * Expects a request body with: { username, email, password }
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ensure required fields are provided.
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    // Check if a user with the same email already exists.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Hash the password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document.
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database.
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Log in a user.
 * Expects a request body with: { email, password }
 * Returns a JWT token if credentials are valid.
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided.
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find the user by email.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the stored hashed password.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Create a JWT payload.
    const payload = { id: user._id, role: user.role };

    // Sign the token with a secret key.
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get the profile of the authenticated user.
 * Assumes that an authentication middleware sets req.user.
 */
const getUserProfile = async (req, res) => {
  try {
    // Find the user by ID and exclude the password field.
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * Update the profile of the authenticated user.
 * Expects a request body with any of the following fields: { username, email, profilePic }
 */
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, profilePic } = req.body;
    // Build an update object with only the fields that were provided.
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profilePic) updateData.profilePic = profilePic;

    // Update the user record.
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");

    res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports={registerUser,loginUser,getUserProfile,updateUserProfile}