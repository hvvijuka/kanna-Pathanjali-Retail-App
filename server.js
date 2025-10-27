require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to fetch images from Cloudinary folder
app.get("/api/getCloudImages", async (req, res) => {
  try {
    const folderName = "Radha"; // Your folder in Cloudinary
    const result = await cloudinary.search
      .expression(`folder:${folderName}/*`)
      .sort_by("public_id", "asc")
      .max_results(50)
      .execute();

    res.json(result.resources); // send array of images
  } catch (err) {
    console.error("Error fetching from Cloudinary:", err);
    res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
