const fs = require("fs");
const path = require("path");
const User = require("../Modal/User");

const createUserJson = async () => {
  try {
    // ✅ DO NOT connect mongoose again here

    const users = await User.find().lean();

    const formattedUsers = users.map(user => ({
      _id: { $oid: user._id.toString() },
      name: user.name,
      email: user.email,
      createdAt: { $date: user.createdAt?.toISOString() },
      updatedAt: { $date: user.updatedAt?.toISOString() },
      __v: user.__v ?? 0
    }));

    // ✅ define directory properly
    const dirPath = path.join(__dirname, "../temp");
    const filePath = path.join(dirPath, "users.json");

    // create folder if not exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(
      filePath,
      JSON.stringify(formattedUsers, null, 2)
    );

    console.log("✅ users.json created");

    return filePath;

  } catch (error) {
    console.error("❌ Export error:", error);
    throw error;
  }
};

module.exports = createUserJson;
