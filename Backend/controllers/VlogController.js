const Vlog = require("../models/Vlog");

/**
 * Create a new Vlog.
 * Expects a request body with: { title, description, videoUrl, productImages, affiliateLinks }
 */
const createVlog = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      videoUrl, 
      productImages, 
      affiliateLinks,
      videoFileUrl,     // optional
      thumbnail,        // optional
      duration          // optional
    } = req.body;

    // Validate required fields
    if (!title || !description || !videoUrl) {
      return res.status(400).json({
        message: "Title, description, and video URL are required."
      });
    }

    // Ensure productImages is an array (or default to an empty array)
    const imagesArray = Array.isArray(productImages) ? productImages : [];

    // Ensure affiliateLinks is an array and each entry has title & url (default values provided)
    const linksArray = Array.isArray(affiliateLinks)
      ? affiliateLinks.map(link => ({
          title: link.title || "Untitled",
          url: link.url || "#",
          clicks: link.clicks || 0,
        }))
      : [];

    // Create a new Vlog document
    // If req.user is not available, you'll need to handle it (or remove the author field from the schema)
    const newVlog = new Vlog({
      title,
      description,
      videoUrl,
      videoFileUrl,    // optional, may be undefined
      thumbnail,       // optional, may be undefined
      duration,        // optional, may be undefined
      productImages: imagesArray,
      affiliateLinks: linksArray,
      // author: req.user ? req.user._id : null // set author from authenticated user, or handle appropriately
    });

    // Save the vlog to the database
    const savedVlog = await newVlog.save();

    return res.status(201).json({
      message: "Vlog created successfully",
      vlog: savedVlog
    });
  } catch (error) {
    console.error("Error creating vlog:", error);
    return res.status(500).json({
      message: "Error creating vlog",
      error: error.message
    });
  }
};



/**
 * Get all Vlogs.
 */
const getAllVlogs = async (req, res) => {
  try {
    // Retrieve all vlogs sorted by creation date (most recent first)
    const vlogs = await Vlog.find().sort({ createdAt: -1 });
    res.status(200).json({ count: vlogs.length, vlogs });
  } catch (error) {
    console.error("Error fetching vlogs:", error);
    res.status(500).json({ message: "Error fetching vlogs", error: error.message });
  }
};

/**
 * Get a single Vlog by its ID.
 */
const getVlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const vlog = await Vlog.findById(id);

    if (!vlog) {
      return res.status(404).json({ message: "Vlog not found" });
    }
    res.status(200).json(vlog);
  } catch (error) {
    console.error("Error fetching vlog:", error);
    res.status(500).json({ message: "Error fetching vlog", error: error.message });
  }
};

/**
 * Update an existing Vlog.
 * Expects a request body with any fields to update.
 */
const updateVlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Update the vlog and return the updated document.
    const updatedVlog = await Vlog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedVlog) {
      return res.status(404).json({ message: "Vlog not found" });
    }

    res.status(200).json({ message: "Vlog updated successfully", vlog: updatedVlog });
  } catch (error) {
    console.error("Error updating vlog:", error);
    res.status(500).json({ message: "Error updating vlog", error: error.message });
  }
};

/**
 * Delete a Vlog.
 */
const deleteVlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVlog = await Vlog.findByIdAndDelete(id);

    if (!deletedVlog) {
      return res.status(404).json({ message: "Vlog not found" });
    }

    res.status(200).json({ message: "Vlog deleted successfully" });
  } catch (error) {
    console.error("Error deleting vlog:", error);
    res.status(500).json({ message: "Error deleting vlog", error: error.message });
  }
};

module.exports = { createVlog, getAllVlogs, getVlogById, updateVlog, deleteVlog };
