import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

function validateEnv() {
    const required = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
        console.error("Missing Cloudinary configuration:", missing.join(", "));
        return false;
    }
    return true;
}

// Config is intentionally removed from here. 
// It will be lazily loaded inside the upload function to ensure dotenv is fully loaded.

const uploadOnCloudinary = async (localFilePath) => {
    if (!validateEnv()) {
        return null;
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        try {
            fs.unlinkSync(localFilePath);
        } catch (_) {}
        return null;
    }
};

export { uploadOnCloudinary };