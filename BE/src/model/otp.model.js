const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OTPModel = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    expires: "1m",
    default: Date.now(),
  },
});
module.exports = mongoose.model("OTP", OTPModel);
