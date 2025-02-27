const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (ObjectId)
      required: true,
    },
    username: {
      type: String, // Directly store the username (instead of userId)
      required: true,
    },
    text: {
      type: String, // The review text
      required: true,
    },
    emojis: {
      type: [String], // Emojis as an array of strings
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
