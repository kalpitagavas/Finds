const mongoose=require("mongoose");
require("dotenv").config();

const AffiliateClickSchema =new mongoose.Schema({
    vlogId: { type: mongoose.Schema.Types.ObjectId, ref: "Vlog", required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    affiliateUrl: { type: String, required: true },
    referrerUrl: { type: String },
    deviceType: { type: String, enum: ["mobile", "desktop", "tablet"], default: "desktop" },
    ipAddress: { type: String }
 }, { timestamps: true } );
const AffiliateClick =mongoose.model("AffiliateClick",AffiliateClickSchema);
module.exports = AffiliateClick;

