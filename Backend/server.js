const express=require("express");
const cors=require("cors");
const userRoutes =require("../Backend/routes/userRoutes");
const vlogRoutes =require("../Backend/routes/vlogRoutes");
const affiliateClickRoutes =require("../Backend/routes/affiliateClickRoutes");
const app=express();
const port=process.env.PORT||8080;

const connection = require("../Backend/config/db.js");

// Call the connection function to connect to MongoDB
connection();
app.use(express.json());

app.use(cors());

//mounts the routes
app.use("/api/users",userRoutes);
app.use("/api/vlogs",vlogRoutes);
app.use("/api/clicks",affiliateClickRoutes);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})