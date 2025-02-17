const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Store hashed password
    role: { type: String, enum: ["admin", "user"], default: "user" }, // Role-based access
    profilePic: { type: String }, // URL for profile picture (optional)
    isVerified: { type: Boolean, default: false }, // Email verification status
    verificationToken: { type: String }, // Token for email verification
    savedProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Users can save vlogs
    affiliateClicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "AffiliateClick" }], // Track affiliate clicks
    lastLogin: { type: Date }, // Store last login timestamp
    status: { type: String, enum: ["active", "banned", "inactive"], default: "active" }
},{ timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
