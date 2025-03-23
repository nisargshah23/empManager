const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Multer-Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "employees",
        allowed_formats: ["jpg", "png", "jpeg"],
        public_id: (req, file) => `profile_${Date.now()}`,
    },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
