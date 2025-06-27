const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/contact.controller");
const adminAuth = require("../middleware/adminAuth");

router.post("/contact-us", ContactController.postContact);
router.get("/all-contact", ContactController.getAllContact);
router.delete("/delete-contact/:_id", adminAuth, ContactController.delContact);
module.exports = router;
