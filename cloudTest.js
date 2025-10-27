require("dotenv").config(); // Make sure you have .env file with your credentials
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test fetching account details
cloudinary.api
  .resources({ max_results: 1 })
  .then((result) => {
    console.log("Cloudinary credentials are working!");
    console.log("Fetched resource:", result.resources[0]);
  })
  .catch((err) => {
    console.error("Error: Cloudinary credentials are invalid or missing.");
    console.error(err);
  });
