const cloudinary = require("../config/cloudinary");

function getFormattedDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
}

module.exports = async function uploadToCloudinary(filePath) {
  const timestamp = getFormattedDateTime();

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "user-json-backups",
    public_id: `users_${timestamp}` // 👈 CUSTOM NAME
  });

  console.log("JSON uploaded:", result.secure_url);
  return result;
};

