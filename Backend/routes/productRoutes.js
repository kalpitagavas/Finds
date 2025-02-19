const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Set up Multer storage to save files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists in your project root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
  },
});

// Set up multer middleware to handle multiple file uploads
const upload = multer({ storage: storage });

// GET: Fetch all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// POST: Create a new product with image and video uploads
router.post("/products", upload.fields([{ name: "images", maxCount: 5 }, { name: "videos", maxCount: 2 }]), async (req, res) => {
  try {
    const imagePaths = req.files["images"] ? req.files["images"].map((file) => file.path) : [];
    const videoPaths = req.files["videos"] ? req.files["videos"].map((file) => file.path) : [];

    const newProduct = new Product({
      ...req.body,
      images: imagePaths,
      videos: videoPaths,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in product creation:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
});

// PUT: Update a product with image and video handling
router.put("/products/:id", upload.fields([{ name: "images", maxCount: 5 }, { name: "videos", maxCount: 2 }]), async (req, res) => {
  try {
    const { name, price, description, status,category  } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle images and videos
    const existingImages = req.body.existingImages ? [].concat(req.body.existingImages) : [];
    const existingVideos = req.body.existingVideos ? [].concat(req.body.existingVideos) : [];

    const removedImages = req.body.removedImages ? [].concat(req.body.removedImages) : [];
    const removedVideos = req.body.removedVideos ? [].concat(req.body.removedVideos) : [];

    // Remove deleted images and videos from storage
    removedImages.forEach((imagePath) => fs.unlink(imagePath, (err) => err && console.error("Error deleting image:", err)));
    removedVideos.forEach((videoPath) => fs.unlink(videoPath, (err) => err && console.error("Error deleting video:", err)));

    // Add new images and videos
    const newImages = req.files["images"] ? req.files["images"].map((file) => file.path) : [];
    const newVideos = req.files["videos"] ? req.files["videos"].map((file) => file.path) : [];

    product.name = name;
    product.price = price;
    product.description = description;
    product.status = status;
    product.category = category; 
    product.images = [...existingImages.filter((img) => !removedImages.includes(img)), ...newImages];
    product.videos = [...existingVideos.filter((vid) => !removedVideos.includes(vid)), ...newVideos];

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

// DELETE: Delete a product and remove images/videos
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    [...product.images, ...product.videos].forEach((file) =>
      fs.unlink(file, (err) => err && console.error("Error deleting file:", err))
    );

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
