const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadJsonToCloudinary = async (filePath) => {
  try {
    console.log("🚀 Upload started for:", filePath);

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      format: "json",
      folder: "json-backups",
      public_id: `users_${Date.now()}`
    });

    console.log("✅ Cloudinary upload SUCCESS");
    console.log("🔗 Cloudinary URL:", result.secure_url);
    console.log("📦 Resource type:", result.resource_type);

    return result;
  } catch (error) {
    console.error("❌ Cloudinary upload FAILED:", error);
  }
};

module.exports = uploadJsonToCloudinary;
