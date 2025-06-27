const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: String,
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    role: {
      type: String,
      enum: ["user", "technician", "admin"],
      required: true,
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending_review", "active", "suspended", "banned"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", AccountSchema);
