const mongoose = require('mongoose');

/**
 * Task 6 Database Connection Module
 * Connects to MongoDB via MONGO_URI with graceful fallback if local service is inactive.
 */
let isDbConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cognifyz_db';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isDbConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${mongoURI}`);
  } catch (err) {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB connection warning: ${err.message}`);
    console.warn(`👉 Operating with memory fallback store. The app will remain fully functional.`);
  }
};

const getDbStatus = () => isDbConnected;

module.exports = { connectDB, getDbStatus };
