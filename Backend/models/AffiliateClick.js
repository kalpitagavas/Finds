const mongoose = require('mongoose');

const affiliateClickSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  deviceType: { type: String, enum: ['mobile', 'desktop', 'tablet'], default: 'desktop' },
  affiliateUrl: { type: String, required: true },
  referrer: { type: String, default: '' }, // Referrer URL
  source: { type: String, enum: ['search', 'email', 'social', 'direct'], default: 'direct' }, // Track click source
  clickedAt: { type: Date, default: Date.now }, // Timestamp of the click
}, { timestamps: true });

const AffiliateClick = mongoose.model('AffiliateClick', affiliateClickSchema);
module.exports = AffiliateClick;
