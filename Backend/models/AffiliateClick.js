const mongoose = require("mongoose");

const AffiliateClickSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    deviceType: { type: String, required: true },
    affiliateUrl: { type: String, required: true },
    referrer: { type: String },
    source: { type: String, required: true },
    clickedAt: { type: Date, default: Date.now },
    count: { type: Number, default: 1 }, // Add the count field with default value of 1
  },
  { timestamps: true }
);

const AffiliateClick = mongoose.model("AffiliateClick", AffiliateClickSchema);

module.exports = AffiliateClick;
