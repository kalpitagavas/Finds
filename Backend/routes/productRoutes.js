const express = require("express");
const Product = require("../models/Product");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Set up Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists in your project root
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// GET: Fetch all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// POST: Create a new product with image and video uploads
router.post("/products", upload.fields([{ name: "images", maxCount: 5 }, { name: "videos", maxCount: 2 }]), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // Handle files
    const imagePaths = req.files["images"] ? req.files["images"].map(file => file.path) : [];
    const videoPaths = req.files["videos"] ? req.files["videos"].map(file => file.path) : [];

    // Create the product
    const product = new Product({
      name,
      price,
      description,
      category,
      images: imagePaths,
      videos: videoPaths,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
});

// PUT: Update a product with image and video handling
// PUT: Update a product with image and video handling
router.put("/products/:id", upload.fields([{ name: "images", maxCount: 5 }, { name: "videos", maxCount: 2 }]), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Parse input values
    const fieldsToUpdate = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      status: req.body.status,
      category: req.body.category,
      specifications: req.body.specifications || product.specifications,
      benefits: req.body.benefits || product.benefits,
      discount: req.body.discount || product.discount,
      tags: req.body.tags ? req.body.tags.split(",").map(tag => tag.trim()) : product.tags,
      buyLink: req.body.buyLink || product.buyLink,
      brand: req.body.brand || product.brand,
      rating: req.body.rating || product.rating,
      reviewsCount: req.body.reviewsCount || product.reviewsCount,
      customerReviews: req.body.customerReviews ? JSON.parse(req.body.customerReviews) : product.customerReviews,
    };

    // Handle existing and removed files
    const existingImages = req.body.existingImages ? [].concat(req.body.existingImages) : product.images;
    const existingVideos = req.body.existingVideos ? [].concat(req.body.existingVideos) : product.videos;
    const removedImages = req.body.removedImages ? [].concat(req.body.removedImages) : [];
    const removedVideos = req.body.removedVideos ? [].concat(req.body.removedVideos) : [];

    // Delete removed files from the file system
    [...removedImages, ...removedVideos].forEach((file) => {
      const filePath = path.resolve(file);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    });

    // Handle new files
    const newImages = req.files?.images?.map(file => file.path) || [];
    const newVideos = req.files?.videos?.map(file => file.path) || [];

    // Update product fields with new and existing files
    product.set({
      ...fieldsToUpdate,
      images: [...existingImages.filter(img => !removedImages.includes(img)), ...newImages],
      videos: [...existingVideos.filter(vid => !removedVideos.includes(vid)), ...newVideos],
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});

// DELETE: Delete a product and remove images/videos
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images and videos from filesystem
    [...product.images, ...product.videos].forEach((file) => {
      const filePath = path.resolve(file);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

module.exports = router;
