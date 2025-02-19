const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Store hashed password
    role: { type: String, enum: ["admin", "user"], default: "user" }, // Role-based access
    profilePic: { type: String }, // URL for profile picture (optional)
    isVerified: { type: Boolean, default: false }, // Email verification status
    verificationToken: { type: String }, // Token for email verification
    savedProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Users can save products
    affiliateClicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "AffiliateClick" }], // Track affiliate clicks
    lastLogin: { type: Date }, // Store last login timestamp
    lastLogout: { type: Date }, // Track last logout time
    status: {
      type: String,
      enum: ["active", "inactive", "banned", "offline", "pending"],
      default: "inactive", // Default to inactive when not logged in
    }, // Track user status (active, inactive, banned, offline, pending)
    isOnline: { type: Boolean, default: false }, // Track whether the user is online
    lastActive: { type: Date }, // Track the last activity time (e.g., page visit)
    loginAttempts: { type: Number, default: 0 }, // Track number of login attempts for security
    failedLoginDate: { type: Date }, // Store the last failed login attempt to implement a lockout strategy
    // Add any additional fields as needed
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
