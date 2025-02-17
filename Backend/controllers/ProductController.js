const express = require("express");

const Product = require("../models/Product");

const router = express.Router();

// Dashboard Overview
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const totalProducts = await Product.countDocuments();
    const totalVlogs = await Vlog.countDocuments();
    const totalAffiliates = await Affiliate.countDocuments();

    res.json({
      totalUsers,
      activeUsers,
      totalProducts,
      totalVlogs,
      totalAffiliates
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user's status
router.put("/users/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all vlogs
router.get("/vlogs", async (req, res) => {
  try {
    const vlogs = await Vlog.find();
    res.json(vlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a vlog
router.delete("/vlogs/:id", async (req, res) => {
  try {
    await Vlog.findByIdAndDelete(req.params.id);
    res.json({ message: "Vlog deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get affiliate data
router.get("/affiliates", async (req, res) => {
  try {
    const affiliates = await Affiliate.find();
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new product
router.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
