const AffiliateClick = require("../models/AffiliateClick");
const Product = require("../models/Product");


const trackClicks = async (req, res) => {
    const { productId, deviceType, affiliateUrl } = req.body; // Extract data from request body
    const userId = req.user._id; // Assuming the user is authenticated
  
    try {
      // Find the product by its ID
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Optionally update the product with the affiliate URL (if you want to store it in the product record)
      if (affiliateUrl) {
        product.affiliateUrl = affiliateUrl;
        await product.save();
      }
  
      // Create a new affiliate click entry
      const newClick = new AffiliateClick({
        user: userId,
        product: productId,
        deviceType: deviceType || "desktop",  // Default to desktop if no device type is provided
        affiliateUrl: affiliateUrl,  // The URL the user will be redirected to
      });
  
      // Save the new click to the database
      await newClick.save();
  
      // Redirect the user to the affiliate URL
      return res.redirect(affiliateUrl);
    } catch (error) {
      console.error("Error tracking affiliate click:", error);
      return res.status(500).json({ message: "Error tracking click", error: error.message });
    }
  };

  const getAllClicks = async (req, res) => {
    try {
      const clicks = await AffiliateClick.find()
        .populate("user", "username") // To get the username of the user who clicked
        .populate("product", "name price affiliateUrl") // To get product name, price, and affiliate URL
        .exec();
  
      return res.json(clicks);
    } catch (error) {
      console.error("Error fetching affiliate clicks:", error);
      return res.status(500).json({ message: "Error fetching affiliate clicks" });
    }
  };

module.exports = { trackClicks,getAllClicks };
