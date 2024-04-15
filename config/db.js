const mongoose = require("mongoose");
require("dotenv").config();

const { URI_DB: uriDb } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(uriDb);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
