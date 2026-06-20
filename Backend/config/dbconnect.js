const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("[FATAL] MongoDB connection failed:", error.message);
    console.error("[FATAL] Server startup aborted — database is required.");
    process.exit(1);
  }
};

module.exports = dbConnect;
