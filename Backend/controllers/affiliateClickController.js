const AffiliateClick = require('../models/AffiliateClick');
const Product = require('../models/Product');

// Track affiliate click route
const trackClicks = async (req, res) => {
    const { productId } = req.params;
    const { userId, deviceType = 'desktop', source = 'direct' } = req.query; // Assuming these are passed as query parameters

    try {
        // Fetch the product to ensure it's valid
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Optionally validate userId if needed (e.g., ensure user exists or is authenticated)
        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        // Create a new AffiliateClick document
        const newClick = new AffiliateClick({
            user: userId,
            product: productId,
            deviceType,
            affiliateUrl: req.originalUrl,
            referrer: req.get('Referrer') || '',  // Capture referrer URL
            source
        });

        // Save the click data to the database
        await newClick.save();

        // Redirect the user to the product's affiliate link or default link
        const redirectUrl = product.buyLink || `http://localhost:8080/products/${productId}`;
        res.redirect(redirectUrl);

    } catch (error) {
        console.error('Error tracking affiliate click:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get all affiliate clicks for admin dashboard
const getAllClicks = async (req, res) => {
    try {
        const clicks = await AffiliateClick.find()
            .populate('user', 'username')  // Fetch the username for each affiliate click
            .populate('product', 'name price affiliateUrl')  // Include product details like name and price
            .exec();

        res.json(clicks); // Return the affiliate clicks data as JSON
    } catch (error) {
        console.error('Error fetching affiliate clicks:', error);
        res.status(500).json({ message: 'Error fetching affiliate clicks' });
    }
};

module.exports = { trackClicks, getAllClicks };
