const mongoose = require("mongoose");

const repairRequestSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    description: String,
    address: String,
    scheduledTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "pending_confirmation",
        "accepted",
        "in_progress",
        "pending_customer_confirmation",
        "completed",
        "complaint",
        "pending_admin_review",
        "warranty_requested",
        "warranty_completed",
        "cancelled",
        "cancelled_with_fee",
      ],
      default: "pending",
    },
    price: {
      amount: Number,
      currency: {
        type: String,
        default: "VND",
      },
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "refunded"],
        default: "pending",
      },
      method: {
        type: String,
        enum: ["cash", "bank_transfer", "e_wallet"],
      },
      transactionId: String,
      paidAt: Date,
    },
    commission: {
      status: {
        type: String,
        enum: ["pending", "eligible", "rejected", "paid"],
        default: "pending",
      },
      amount: Number,
      paidAt: Date,
    },
    timeline: [
      {
        status: String,
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    feedback: {
      rating: Number,
      comment: String,
      createdAt: Date,
    },
    warranty: {
      requested: {
        type: Boolean,
        default: false,
      },
      description: String,
      status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "rejected"],
        default: "pending",
      },
    },
    cancellation: {
      reason: String,
      fee: Number,
      cancelledAt: Date,
    },
    confirmationTimeout: {
      type: Date,
    },
    confirmationAssignedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    customerConfirmation: {
      confirmedAt: Date,
      satisfied: Boolean,
      complaintReason: String,
      complaintDescription: String,
      confirmationTimeout: Date,
      confirmationAssignedAt: Date,
    },
    adminReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      reviewedAt: Date,
      decision: {
        type: String,
        enum: ["approved", "rejected"],
      },
      reason: String,
      assignedTechnician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technician",
      },
    },
    warrantyWork: {
      completedAt: Date,
      workDescription: String,
      partsUsed: [String],
      notes: String,
    },
    warrantyConfirmation: {
      confirmedAt: Date,
      satisfied: Boolean,
      rating: Number,
      comment: String,
    },
    warrantyComplaint: {
      complainedAt: Date,
      reason: String,
      description: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RepairRequest", repairRequestSchema);
