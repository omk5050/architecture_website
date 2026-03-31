import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// ✅ Cloudinary config (FIXED ENV NAMES)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Multer memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit (optional but recommended)
  }
});

// ✅ Upload function (SAFE STREAM VERSION)
export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {

    if (!file) {
      return resolve("");
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogs"
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY ERROR:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};