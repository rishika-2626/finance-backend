const mongoose = require("mongoose"); // imports the mongoose library

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error:", error.message);
    process.exit(1); //stops server
  }
};

module.exports = connectDB;

/*
Server starts
   ↓
connectDB() runs
   ↓
Mongoose tries connecting to MongoDB
   ↓
If success:
    "MongoDB connected"

If failure:
    show error
    stop server
*/

