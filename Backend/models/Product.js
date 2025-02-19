const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    description: { type: String, required: true },
    images: [{ type: String }], // Array to store multiple image paths
    videos: [{ type: String }], // Array to store multiple video paths
    category: { 
      type: String, 
      required: true, // If you want category to be required
      enum: ["Kitchen Finds", "Home Decor", "Aesthetic Look"], // Optional, to limit the category options
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
