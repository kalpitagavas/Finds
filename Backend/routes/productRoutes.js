const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Set up Multer storage to save images in a directory called 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists in your project root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
  }
});

// Set up multer middleware to handle multiple image uploads
const upload = multer({ storage: storage });

// GET: Fetch all products (active and inactive)
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// POST: Create a new product with multiple image uploads
router.post("/products", upload.array("images", 5), async (req, res) => {
  try {
    const imagePaths = req.files.map(file => file.path); // Extract file paths

    const newProduct = new Product({
      ...req.body,
      images: imagePaths, // Store array of image paths
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in product creation:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
});


// PUT: Update a product
router.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// DELETE: Delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
