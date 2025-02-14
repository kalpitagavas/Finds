// const mongoose = require("mongoose");
// require("dotenv").config();

// const VlogSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     videoUrl: { type: String, required: true }, // YouTube or local video
//     productImages: [{ type: String }], // List of image URLs
//     affiliateLinks: [{ 
//         title: String, 
//         url: String, 
//         clicks: { type: Number, default: 0 }
//     }],
//     views: { type: Number, default: 0 },
//     watchTime: { type: Number, default: 0 },
// },{timestamps:true});

// const Vlog = mongoose.model("Vlog", VlogSchema);
// module.exports = Vlog;
const mongoose = require("mongoose");
require("dotenv").config();

const VlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Video fields:
  videoUrl: { type: String, required: true }, // e.g., YouTube URL
  videoFileUrl: { type: String }, // URL for an uploaded video file (optional)
  thumbnail: { type: String }, // A thumbnail image for the video
  duration: { type: Number }, // Duration in seconds
  
  productImages: [{ type: String }], // List of image URLs
  affiliateLinks: [{ 
      title: String, 
      url: String, 
      clicks: { type: Number, default: 0 }
  }],
  views: { type: Number, default: 0 },
  watchTime: { type: Number, default: 0 },
  
  // Additional fields for categorization & related products
  category: { 
      type: String, 
      enum: ["top", "default"], 
      default: "default" 
  },
  isTopProduct: { type: Boolean, default: false },
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vlog" }],
  
  // Extra metadata
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
//   author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
      type: String, 
      enum: ["draft", "published", "archived"], 
      default: "draft" 
  },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Vlog = mongoose.model("Vlog", VlogSchema);
module.exports = Vlog;
