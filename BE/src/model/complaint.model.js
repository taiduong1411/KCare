const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepairRequest",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    type: {
      type: String,
      enum: ["service_quality", "technician_behavior", "pricing", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [String],
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected"],
      default: "pending",
    },
    resolution: {
      type: {
        type: String,
        enum: ["warranty", "refund", "discount", "other"],
      },
      description: String,
      amount: Number,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      resolvedAt: Date,
    },
    timeline: [
      {
        status: String,
        description: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
