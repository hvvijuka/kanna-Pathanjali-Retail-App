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

// ----------------------------
// Signature route (signed upload)
// ----------------------------
app.get("/api/signature", (req, res) => {
  try {
    const { folder } = req.query; // get folder from frontend
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = { timestamp };
    if (folder) paramsToSign.folder = folder; // include folder in signature

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    console.error("Error generating signature:", err);
    res.status(500).json({ error: "Failed to generate signature" });
  }
});

// ----------------------------
// Example: fetch images from folder
// ----------------------------
app.get("/api/getCloudImages", async (req, res) => {
  try {
    const folderName = "Radha"; // Asset folder
    const result = await cloudinary.search
      .expression(`folder:${folderName}/*`)
      .sort_by("public_id", "asc")
      .max_results(100)
      .execute();

    res.json(result.resources); // send array of images
  } catch (err) {
    console.error("Error fetching from Cloudinary:", err);
    res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
  }
});

// ----------------------------
// Start server
// ----------------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
