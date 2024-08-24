// const logger = require("../logger/logger");
// const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
// // import { v2 as cloudinary } from "cloudinary";

// // Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// const uploadOnCloudinary = async (file) => {
//   try {
//     if (!file) return null;
//     const response = await cloudinary.uploader.upload(file, {
//       resource_type: "auto",
//     });
//     logger.info(response);
//     logger.info("File uploaded");
//     return response;
//   } catch (error) {
//     fs.unlinkSync(file);
//     console.log(error);
//   }
// };
