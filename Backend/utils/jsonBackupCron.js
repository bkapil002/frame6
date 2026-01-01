const cron = require("node-cron");
const createUserJson = require("./createUserJson");
const uploadJsonToCloudinary = require("./uploadJsonToCloudinary");

let isCronStarted = false;
let isJobRunning = false;

const startJsonBackupCron = () => {
  if (isCronStarted) return;
  isCronStarted = true;

  cron.schedule("* * * * *", async () => {
    if (isJobRunning) {
      console.log("⏭ Previous job still running, skipping...");
      return;
    }

    isJobRunning = true;
    console.log("⏳ Sending JSON to Cloudinary (every 1 min)");

    try {
      const filePath = await createUserJson();
      if (filePath) {
        await uploadJsonToCloudinary(filePath);
      }
    } catch (err) {
      console.error("❌ JSON CRON error:", err);
    } finally {
      isJobRunning = false;
    }
  });

  console.log("✅ JSON CRON started (NO SERVER RELOAD)");
};

module.exports = startJsonBackupCron;
