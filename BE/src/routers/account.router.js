const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/account.controller");
const adminAuth = require("../middleware/adminAuth");
// Authentication routes
router.post("/login", AccountController.login);
router.post("/register", AccountController.register);
router.post("/register-technician", AccountController.registerTechnician);
router.get("/user-info/:id", AccountController.getUserInfo);
router.post("/verify-email", AccountController.verifyEmail);
router.post("/reset-password", AccountController.resetPassword);
router.put("/update-user-info", AccountController.updateUserInfo);
module.exports = router;
