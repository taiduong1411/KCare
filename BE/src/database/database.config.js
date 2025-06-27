const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGO_URI_COMPASS;
async function connect() {
  try {
    await mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("connect db success");
  } catch (error) {
    console.log("error");
  }
}
module.exports = { connect };
