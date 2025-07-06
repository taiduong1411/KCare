const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.controller");
const BookingController = require("../controllers/booking.controller");
const adminAuth = require("../middleware/adminAuth");

// Service
router.post("/create-service", adminAuth, AdminController.createService);
router.get("/get-services", AdminController.getServices);
router.put("/update-service/:id", adminAuth, AdminController.updateService);
router.delete("/delete-service/:id", adminAuth, AdminController.deleteService);

// Contact
router.post("/reply-customer-email", adminAuth, AdminController.replyCustomer);
// technician
router.get("/get-all-technicians", AdminController.getAllTechnicians);
router.get("/get-active-technicians", AdminController.getActiveTechnicians);
router.get(
  "/get-technician-by-id/:id",
  adminAuth,
  AdminController.getTechnicianById
);
router.post("/create-technician", adminAuth, AdminController.createTechnician);
router.put(
  "/update-technician/:id",
  adminAuth,
  AdminController.updateTechnician
);
router.delete(
  "/delete-technician/:id",
  adminAuth,
  AdminController.deleteTechnician
);
router.put(
  "/approve-technician/:id",
  adminAuth,
  AdminController.approveTechnician
);
router.put(
  "/reject-technician/:id",
  adminAuth,
  AdminController.rejectTechnician
);
router.put(
  "/suspend-technician/:id",
  adminAuth,
  AdminController.suspendTechnician
);
router.put("/ban-technician/:id", adminAuth, AdminController.banTechnician);
router.put(
  "/activate-technician/:id",
  adminAuth,
  AdminController.activateTechnician
);
router.put("/unban-technician/:id", adminAuth, AdminController.unbanTechnician);

// Complaint Management
router.get("/complaints", adminAuth, BookingController.getAllComplaints);
router.put(
  "/complaints/:bookingId/review",
  adminAuth,
  BookingController.reviewComplaint
);
router.get(
  "/technicians/available-for-warranty",
  adminAuth,
  BookingController.getAvailableTechniciansForWarranty
);
router.get(
  "/technicians/complaint-stats",
  adminAuth,
  BookingController.getTechnicianComplaintStats
);

module.exports = router;
