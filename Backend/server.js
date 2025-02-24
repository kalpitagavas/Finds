const express = require("express");
const cors = require("cors");
const userRoutes = require("../Backend/routes/userRoutes");
const vlogRoutes = require("../Backend/routes/vlogRoutes");
const affiliateClickRoutes = require("../Backend/routes/affiliateClickRoutes");
const productRoutes = require("./routes/productRoutes.js");
const userProductRoutes = require("./routes/userProductRoutes.js");
const { trackClicks, getAllClicks } = require('./controllers/affiliateClickController.js');
const app = express();
const port = process.env.PORT || 8080;

const connection = require("../Backend/config/db.js");

// Connect to MongoDB
connection();

app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/vlogs", vlogRoutes);
app.use("/api", affiliateClickRoutes);
app.use("/api/admin", productRoutes);
app.use("/api/user", userProductRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
