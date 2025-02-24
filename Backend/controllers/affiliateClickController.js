const AffiliateClick = require("../models/AffiliateClick");
const Product = require("../models/Product");
const User = require("../models/User"); // Make sure to import the User model

// Track affiliate click route (POST request)
const trackClicks = async (req, res) => {
  const { productId } = req.params;
  const { userId, deviceType, source, affiliateUrl, referrer } = req.body;

  try {
    // Find if the click record already exists for the same user and product
    const existingClick = await AffiliateClick.findOne({
      user: userId,
      product: productId,
    });

    if (existingClick) {
      // If the click already exists, increment the count
      existingClick.count += 1; // Increment the count
      existingClick.clickedAt = new Date(); // Update the clickedAt timestamp to the current time
      await existingClick.save(); // Save the updated record
      return res.status(200).json({
        message: "Click updated successfully!",
        count: existingClick.count,
      });
    }

    // If no click exists, create a new click record with count set to 1
    const newClick = new AffiliateClick({
      user: userId,
      product: productId,
      deviceType,
      affiliateUrl,
      referrer,
      source,
      clickedAt: new Date(),
      count: 1, // Initialize the count to 1
    });

    await newClick.save(); // Save the new click record
    res
      .status(200)
      .json({ message: "Click tracked successfully!", count: newClick.count });
  } catch (error) {
    console.error("Error tracking affiliate click:", error);
    res.status(500).json({ message: "Error tracking click" });
  }
};

// Get all affiliate clicks for admin dashboard (GET request)
const getAllClicks = async (req, res) => {
  try {
    const clicks = await AffiliateClick.find()
      .populate("user", "username") // Fetch the username for each affiliate click
      .populate("product", "name price affiliateUrl") // Include product details like name and price
      .exec();

    res.json(clicks); // Return the affiliate clicks data as JSON
  } catch (error) {
    console.error("Error fetching affiliate clicks:", error);
    res
      .status(500)
      .json({ message: `Error fetching affiliate clicks: ${error.message}` });
  }
};

module.exports = { trackClicks, getAllClicks };
