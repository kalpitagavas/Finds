const AffiliateClick=require("../models/AffiliateClick");

const trackClicks=async(req,res)=>{
    try{
        const { vlogId, affiliateUrl, referrerUrl, deviceType } =req.body;
        // Extract the IP address from the request (works in most cases)
        const ipAddress =req.ip;
        const newClick=new AffiliateClick({
            vlogId,
            userId: req.user ? req.user.id : null,
            affiliateUrl,
            ipAddress,
            referrerUrl,
            deviceType
        })
        await newClick.save();
        res.status(201).json({message:"Affiliate click tracked successfully",  click: newClick,})
    }
    catch(error){
        res.status(500).json({message:"error in trackingClicks for Affiliate Links",error: error.message})
    }

}
// Get all affiliate clicks for a given vlog
const getClicksByVlog = async(req,res)=>{
    try{
        const { vlogId } = req.params;
        const clicks=await AffiliateClick.find({vlogId}).populate("userid","username email");
        res.status(201).json({count:clicks.length,clicks});
    }
    catch(error){
        res.status(500).json({message:"error in getClicksByVlog for Affiliate",error:error.message});
    }
}

// Get all affiliate clicks for a specific user
const getClicksByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const clicks = await AffiliateClick.find({ userId }).populate("vlogId", "title description");
      res.status(200).json({ count: clicks.length, clicks });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user clicks", error: error.message });
    }
  };
module.exports={trackClicks,getClicksByVlog,getClicksByUser};