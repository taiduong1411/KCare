const cron = require("node-cron");
const RepairRequest = require("../model/repairRequest.model");
const Technician = require("../model/technician.model");

// Import helper functions từ booking controller
const {
  checkTechnicianAvailability,
  calculateAssignmentScore,
} = require("../controllers/booking.controller");

// Helper function để phân công lại kỹ thuật viên (copy từ booking controller)
const reassignTechnician = async (booking) => {
  try {
    console.log(
      `🔄 [Scheduler] Reassigning technician for booking ${booking._id}`
    );

    // Lấy thông tin địa chỉ để tìm district
    const addressParts = booking.address.split(",");
    const district =
      addressParts.length > 1
        ? addressParts[addressParts.length - 1].trim()
        : null;

    // Tìm tất cả kỹ thuật viên đủ điều kiện (trừ người đã từ chối)
    const availableTechnicians = await Technician.find({
      status: "active",
      depositStatus: "paid",
      _id: { $ne: booking.technician._id }, // Exclude current technician
      $or: [
        { services: { $in: [booking.service._id] } },
        { services: { $size: 0 } },
        { services: { $exists: false } },
      ],
    });

    console.log(
      `📋 [Scheduler] Found ${availableTechnicians.length} potential technicians for reassignment`
    );

    if (availableTechnicians.length === 0) {
      // Không có kỹ thuật viên khác, đặt lại trạng thái pending
      booking.status = "pending";
      booking.technician = null;
      booking.confirmationTimeout = null;
      booking.confirmationAssignedAt = null;
      booking.timeline.push({
        status: "pending",
        description:
          "Hết thời gian xác nhận, không tìm thấy kỹ thuật viên khác",
        createdAt: new Date(),
      });
      await booking.save();
      return { success: false, booking };
    }

    // Tính điểm cho các kỹ thuật viên có thể (simplified logic)
    const availableTechsWithScore = [];
    for (const tech of availableTechnicians) {
      // Simplified availability check
      availableTechsWithScore.push({
        technician: tech,
        score: { total: Math.random() * 100 }, // Simplified scoring
      });
    }

    if (availableTechsWithScore.length === 0) {
      // Không có kỹ thuật viên rảnh, đặt lại trạng thái pending
      booking.status = "pending";
      booking.technician = null;
      booking.confirmationTimeout = null;
      booking.confirmationAssignedAt = null;
      booking.timeline.push({
        status: "pending",
        description: "Hết thời gian xác nhận, không có kỹ thuật viên rảnh",
        createdAt: new Date(),
      });
      await booking.save();
      return { success: false, booking };
    }

    // Sắp xếp và chọn kỹ thuật viên tốt nhất
    availableTechsWithScore.sort((a, b) => b.score.total - a.score.total);
    const bestTechnician = availableTechsWithScore[0];

    // Cập nhật booking với kỹ thuật viên mới
    booking.technician = bestTechnician.technician._id;
    booking.status = "pending_confirmation";
    booking.confirmationTimeout = new Date(Date.now() + 2 * 60 * 1000); // 2 phút mới
    booking.confirmationAssignedAt = new Date();
    booking.timeline.push({
      status: "pending_confirmation",
      description: `Hết thời gian xác nhận, đã phân công cho kỹ thuật viên khác. Vui lòng xác nhận trong 2 phút.`,
      createdAt: new Date(),
    });

    await booking.save();

    console.log(
      `✅ [Scheduler] Reassigned to technician ${bestTechnician.technician._id}`
    );

    return { success: true, booking };
  } catch (error) {
    console.error("Error in reassignTechnician:", error);
    return { success: false, booking, error: error.message };
  }
};

// Function để kiểm tra và xử lý technician timeout
const checkTechnicianTimeouts = async () => {
  try {
    const now = new Date();

    // Tìm tất cả booking đang chờ xác nhận và đã hết timeout
    const expiredBookings = await RepairRequest.find({
      status: "pending_confirmation",
      confirmationTimeout: { $lt: now },
    })
      .populate("service", "name description duration")
      .populate({
        path: "technician",
        populate: {
          path: "account",
          select: "fullName phone",
        },
      });

    if (expiredBookings.length > 0) {
      console.log(
        `⏰ [Scheduler] Found ${expiredBookings.length} expired technician confirmations`
      );

      for (const booking of expiredBookings) {
        console.log(
          `⏰ [Scheduler] Processing expired booking ${booking.orderCode}`
        );

        // Thêm timeout event vào timeline
        booking.timeline.push({
          status: "timeout",
          description: `Kỹ thuật viên ${booking.technician.account.fullName} không phản hồi trong thời gian quy định (2 phút)`,
          createdAt: new Date(),
        });

        // Thử phân công lại
        const reassignResult = await reassignTechnician(booking);

        if (reassignResult.success) {
          console.log(
            `✅ [Scheduler] Successfully reassigned booking ${booking.orderCode}`
          );
        } else {
          console.log(
            `❌ [Scheduler] Failed to reassign booking ${booking.orderCode}`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in checkTechnicianTimeouts:", error);
  }
};

// Function để kiểm tra và xử lý customer confirmation timeout
const checkCustomerConfirmationTimeouts = async () => {
  try {
    const now = new Date();

    // Tìm tất cả booking đang chờ khách hàng xác nhận và đã hết timeout
    const expiredOrders = await RepairRequest.find({
      status: "pending_customer_confirmation",
      "customerConfirmation.confirmationTimeout": { $lt: now },
    })
      .populate("customer", "fullName email phone")
      .populate("service", "name description commissionRate")
      .populate({
        path: "technician",
        populate: {
          path: "account",
          select: "fullName phone",
        },
      });

    if (expiredOrders.length > 0) {
      console.log(
        `⏰ [Scheduler] Found ${expiredOrders.length} expired customer confirmations`
      );

      for (const booking of expiredOrders) {
        try {
          console.log(
            `⏰ [Scheduler] Auto-completing booking ${booking.orderCode} due to customer timeout`
          );

          // Auto-complete the order
          booking.status = "completed";
          booking.payment.status = "pending";

          // Mark commission as eligible
          booking.commission.status = "eligible";

          // Update customer confirmation
          booking.customerConfirmation.satisfied = true;
          booking.customerConfirmation.confirmedAt = new Date();

          // Add automatic completion to timeline
          booking.timeline.push({
            status: "completed",
            description: `Đơn hàng được tự động hoàn thành do khách hàng không xác nhận trong thời hạn 2 phút`,
            createdAt: new Date(),
          });

          await booking.save();

          // Update technician stats
          await Technician.findByIdAndUpdate(booking.technician._id, {
            $inc: {
              completedJobs: 1,
              totalEarnings: booking.commission.amount,
            },
          });

          console.log(
            `✅ [Scheduler] Auto-completed order ${booking.orderCode} due to customer confirmation timeout`
          );
        } catch (error) {
          console.error(
            `❌ [Scheduler] Error auto-completing order ${booking.orderCode}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in checkCustomerConfirmationTimeouts:", error);
  }
};

// Combined function để kiểm tra tất cả timeout
const checkTimeouts = async () => {
  await checkTechnicianTimeouts();
  await checkCustomerConfirmationTimeouts();
};

// Chạy mỗi phút để kiểm tra timeout
const startScheduler = () => {
  console.log("🚀 Starting timeout scheduler...");

  // Chạy mỗi phút
  cron.schedule("* * * * *", () => {
    console.log("⏰ [Scheduler] Running timeout check...");
    checkTimeouts();
  });
};

module.exports = {
  startScheduler,
  checkTimeouts,
  checkTechnicianTimeouts,
  checkCustomerConfirmationTimeouts,
};
