const mongoose = require("mongoose");
require("dotenv").config();

const VlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true }, // YouTube or local video
    productImages: [{ type: String }], // List of image URLs
    affiliateLinks: [{ 
        title: String, 
        url: String, 
        clicks: { type: Number, default: 0 }
    }],
    views: { type: Number, default: 0 },
    watchTime: { type: Number, default: 0 },
},{timestamps:true});

const Vlog = mongoose.model("Vlog", VlogSchema);
module.exports = Vlog;