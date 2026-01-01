require("dotenv").config();
const exportUsers = require("./exportUsers");
const uploadToCloudinary = require("./uploadToCloudinary");
const cron = require("node-cron");

async function userdata() {
  try {
    console.log("Running user backup...");
    const filePath = await exportUsers();  
    await uploadToCloudinary(filePath);
    console.log("✅ Backup completed at", new Date().toLocaleString());
  } catch (error) {
    console.error("❌ Backup failed:", error);
  }
}

function autoUserDaTa() {
  userdata();  // run once immediately
  cron.schedule("* * * * *", () => {
    userdata();  // run every 10 minutes
  });
}

module.exports = { autoUserDaTa };
