const express=require("express");
const router=express.Router();
const{registerUser,loginUser,getUserProfile,updateUserProfile}=require("../controllers/UserController");
const authMiddleware=require("../middleware/AuthMiddleware");
const adminMiddleware = require("../middleware/AdminMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route: Any authenticated user can view and update their own profile
router.get("/profile", authMiddleware ,getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);



module.exports = router;