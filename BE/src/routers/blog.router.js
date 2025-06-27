const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/blog.controller");
const adminAuth = require("../middleware/adminAuth");

router.get("/all-blogs", BlogController.getBlogs);
router.get("/user-get-blogs", BlogController.useBlogs);
router.get("/user-get-detail/:slug", BlogController.getDetailBySlugBlogs);
router.get("/user-get-blogs-by-tag/:query", BlogController.getBlogsByTag);
router.get("/user-all-blogs", BlogController.getAllDataBlogs);

router.post("/create-blogs", adminAuth, BlogController.createBlogs);
router.post("/update-blogs/:id", adminAuth, BlogController.updateBlogs);
router.delete("/del-blogs-id/:id", adminAuth, BlogController.delBlogs);
module.exports = router;
