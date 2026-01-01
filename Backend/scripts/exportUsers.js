const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../Modal/User");

module.exports = async function exportUsers() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected");

    const users = await User.find().lean(); // IMPORTANT: lean()

    const formattedUsers = users.map(user => ({
      _id: { $oid: user._id.toString() },
      name: user.name,
      email: user.email,
      createdAt: { $date: user.createdAt?.toISOString() },
      updatedAt: { $date: user.updatedAt?.toISOString() },
      __v: user.__v ?? 0
    }));

    const filePath = path.join(__dirname, "users.json");

    fs.writeFileSync(
      filePath,
      JSON.stringify(formattedUsers, null, 2)
    );

    console.log("users.json created (MongoDB format)");

    await mongoose.connection.close();
    return filePath;

  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
