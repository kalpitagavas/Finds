const mongoose = require("mongoose");

// Define the Customer Review Schema
const customerReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Prevents creation of an _id for subdocuments
);

// Define the Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null }, // Optional, defaults to null if not provided
    isOnSale: { type: Boolean, default: false }, // Indicates if the product is currently on sale
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    description: { type: String, required: true },
    images: { type: [String], default: [] }, // Array with default empty array
    videos: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: ["Kitchen Finds", "Home Decor", "Aesthetic Look", "Electronics"], // Added 'Electronics' category
    },
    specifications: { type: String, default: "" },
    benefits: { type: String, default: "" },
    customerReviews: { type: [customerReviewSchema], default: [] }, // Embedding customer reviews
    discount: { type: Number, default: 0 }, // Discount amount or percentage
    tags: { type: [String], default: [] },
    buyLink: { type: String, default: "" },
    brand: { type: String, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 0 }, // Store the average rating (will be updated)
    reviewsCount: { type: Number, default: 0 }, // Track the number of reviews
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Mongoose middleware to update rating and reviewsCount when a new review is added
productSchema.pre("save", function (next) {
  if (this.customerReviews.length > 0) {
    const totalRating = this.customerReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    this.rating = totalRating / this.customerReviews.length;
    this.reviewsCount = this.customerReviews.length;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
