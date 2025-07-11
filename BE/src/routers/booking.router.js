const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/booking.controller");

// Public API để lấy danh sách services (không cần auth)
router.get("/services", BookingController.getPublicServices);

// Tạo booking mới
router.post("/create-booking", BookingController.createBooking);

// Lấy danh sách booking của user hiện tại
router.get("/my-bookings", BookingController.getMyBookings);

// Lấy danh sách booking của user (với pagination)
router.get("/user-bookings", BookingController.getUserBookings);

// Kiểm tra thời gian rảnh của technician
router.get(
  "/check-availability",
  BookingController.checkTechnicianAvailability
);

// Lấy khung giờ trống của kỹ thuật viên
router.get("/available-slots", BookingController.getAvailableTimeSlots);

// Tra cứu booking theo mã đơn hàng (public API - không cần auth)
router.get("/search/:orderCode", BookingController.searchByOrderCode);

// Lấy danh sách đơn hàng của kỹ thuật viên
router.get("/technician-bookings", BookingController.getTechnicianBookings);

// Lấy chi tiết booking
router.get("/:bookingId", BookingController.getBookingDetails);

// Hủy booking
router.put("/:bookingId/cancel", BookingController.cancelBooking);

// Cập nhật trạng thái booking
router.put("/:bookingId/status", BookingController.updateBookingStatus);

// Thêm ghi chú vào timeline
router.post("/:bookingId/timeline", BookingController.addTimelineNote);

// Technician workflow routes
router.get("/technician/orders", BookingController.getTechnicianOrders);
router.put("/:bookingId/confirm", BookingController.confirmOrder);
router.put("/:bookingId/reject", BookingController.rejectOrder);
router.put("/:bookingId/start", BookingController.startRepair);
router.put("/:bookingId/complete", BookingController.completeRepair);

// Customer confirmation routes
router.put(
  "/:bookingId/confirm-completion",
  BookingController.confirmCompletion
);
router.put("/:bookingId/report-complaint", BookingController.reportComplaint);
router.put("/:bookingId/cancel-complaint", BookingController.cancelComplaint);

// Warranty routes
router.put(
  "/:bookingId/complete-warranty",
  BookingController.completeWarrantyRepair
);
router.put(
  "/:bookingId/confirm-warranty-completion",
  BookingController.confirmWarrantyCompletion
);
router.put(
  "/:bookingId/report-warranty-complaint",
  BookingController.reportWarrantyComplaint
);

// System maintenance routes
router.post("/check-timeouts", BookingController.checkTimeouts);
router.post(
  "/check-customer-timeouts",
  BookingController.checkCustomerConfirmationTimeouts
);

module.exports = router;
