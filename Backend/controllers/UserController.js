const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const path = require("path");


// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp to avoid duplicates
  },
});

const upload = multer({ storage }).single("profilePhoto"); 
// Register a new user
const registerUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    try {
      const { username, email, password, adminSecretKey } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Default role
      let role = "user";

      // Check if the admin secret key matches
      if (adminSecretKey && adminSecretKey === process.env.ADMIN_SECRET_KEY) {
        role = "admin";
      }

      // Handle the profile picture upload
      const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

      const newUser = new User({ username, email, password: hashedPassword, role, profilePic });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully", user: { ...newUser._doc, profilePic } });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email ||!password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Create a JWT payload
    const payload = { id: user._id, role: user.role };

    // Sign the token with a secret key
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Update the last login timestamp and status
    user.lastLogin = new Date();
    user.isOnline = true;
    user.status = "active";
    await user.save();

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  // Use the upload middleware to handle file uploads (profile image)
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    try {
      const { username, email } = req.body;
      // Validate email uniqueness if provided
      if (email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== req.user.id.toString()) {
          return res.status(400).json({ message: "Email is already in use." });
        }
      }
      // Validate username uniqueness if provided
      if (username) {
        const usernameExists = await User.findOne({ username });
        if (usernameExists && usernameExists._id.toString() !== req.user.id.toString()) {
          return res.status(400).json({ message: "Username is already taken." });
        }
      }

      // Prepare update data object
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      // If a file is uploaded, update the profilePic field
      if (req.file) {
        updateData.profilePic = `/uploads/${req.file.filename}`;
      }

      // Update the user in the database and return the updated record (excluding password)
      const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");

      res.status(200).json({
        message: "User profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// Logout a user
const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user status and last logout time
    user.isOnline = false;
    user.status = "offline";
    user.lastLogout = new Date();
    await user.save();

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
};
