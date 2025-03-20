const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.Promise = global.Promise;

const connectToDB = () => {
  return mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB Connection Succeeded.");
    })
    .catch((err) => {
      // console.log("Error in DB connection: ", err);
      throw new Error("Database connection failed");
    });
};

module.exports = connectToDB;
