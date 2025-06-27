const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TechnicianSchema = new Schema(
  {
    // Account reference
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true,
    },

    // Personal Information (from form)
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },

    // Professional Information (from form)
    district: { type: String, required: true }, // Khu vực hoạt động
    experience: { type: String, required: true }, // Kinh nghiệm
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ], // Dịch vụ đăng ký

    // Banking Information (from form)
    bankName: { type: String, required: true },
    bankAccount: { type: String, required: true },
    bankOwner: { type: String, required: true },

    // Ký quỹ System (1,000,000 VND required)
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    requiredDeposit: {
      type: Number,
      default: 1000000, // 1 triệu VND
    },
    depositStatus: {
      type: String,
      enum: ["pending", "paid", "active", "suspended"],
      default: "pending",
    },
    depositPaidAt: { type: Date },

    // Commission & Earnings System
    totalEarnings: {
      type: Number,
      default: 0, // Tổng hoa hồng kiếm được
    },
    availableBalance: {
      type: Number,
      default: 0, // Số tiền có thể rút (earnings - deposit)
    },
    totalWithdrawn: {
      type: Number,
      default: 0, // Tổng đã rút
    },
    // Performance Metrics
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "banned"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Technician", TechnicianSchema);
