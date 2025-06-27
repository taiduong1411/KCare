const Blogs = require("../model/blog.model");
require("dotenv");
const errorMsg = process.env.ERROR;
const successMSG = process.env.SUCCESS;
const cloudinary = require("cloudinary");
const services = require("../services/services");
const BlogController = {
  getBlogs: async (req, res, next) => {
    await Blogs.find()
      .lean()
      .then((news) => {
        return res.status(200).json(news);
      });
  },
  createBlogs: async (req, res, next) => {
    await Blogs.findOne({ title: req.body.title })
      .then(async (n) => {
        if (n) return res.status(300).json({ msg: "Nội Dung Đã Tồn Tại" });
        await Blogs(req.body).save();
        return res.status(200).json({ msg: successMSG });
      })
      .catch((e) => {
        return res.status(500).json({ msg: errorMsg });
      });
  },
  useBlogs: async (req, res, next) => {
    await Blogs.find({ status: true })
      .lean()
      .limit(4)
      .sort({ createdAt: -1 })
      .then((news) => {
        return res.status(200).json(news);
      });
  },
  delBlogs: async (req, res, next) => {
    await Blogs.findByIdAndDelete(req.params.id)
      .then(async (news) => {
        await services.delImg(news.img_cover[0].id);
        return res.status(200).json({ msg: "Xoá Thành Công" });
      })
      .catch((err) => {
        return res.status(500).json({ msg: "Lỗi Hệ Thống" });
      });
  },
  getDetailBySlugBlogs: async (req, res, next) => {
    await Blogs.findOne({ slug: req.params.slug })
      .then((news) => {
        news = {
          title: news.title,
          sub_content: news.sub_content,
          content: news.content,
          hashtags: news.hashtags,
          img_cover: news.img_cover[0].url,
          updatedAt: news.updatedAt.toLocaleDateString("en-Gb"),
        };
        return res.status(200).json(news);
      })
      .catch((e) => {
        return res.status(500).json({ msg: "Có lỗi xảy ra" });
      });
  },
  getBlogsByTag: async (req, res, next) => {
    try {
      const query = req.params.query;
      const ITEMS_PER_PAGE = 8;
      const page = +req.query.page || 1;
      const regex = new RegExp(query, "i");
      let news = await Blogs.find({ hashtags: regex })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ createdAt: -1 });
      news = news.map((n) => {
        return {
          title: n.title,
          sub_content: n.sub_content,
          content: n.content,
          hashtags: n.hashtags,
          img_cover: n.img_cover[0].url,
          slug: n.slug,
          updatedAt: n.updatedAt.toLocaleDateString("en-Gb"),
        };
      });
      const totalItems = await Blogs.countDocuments();
      return res.status(200).json({
        news: news,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        totalItems: totalItems,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getAllDataBlogs: async (req, res, next) => {
    try {
      const ITEMS_PER_PAGE = 9;
      const page = +req.query.page || 1;
      let news = await Blogs.find({ status: true })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ createdAt: -1 });
      news = news.map((n) => {
        return {
          title: n.title,
          sub_content: n.sub_content,
          content: n.content,
          hashtags: n.hashtags,
          img_cover: n.img_cover[0].url,
          slug: n.slug,
          updatedAt: n.updatedAt.toLocaleDateString("en-Gb"),
        };
      });
      const totalItems = await Blogs.countDocuments();
      const uniqueHashtags = await Blogs.aggregate([
        { $unwind: "$hashtags" },
        { $group: { _id: { $toLower: "$hashtags" } } },
        { $sort: { _id: 1 } },
      ]);
      return res.status(200).json({
        news: news,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        totalItems: totalItems,
        uniqueHashtags: uniqueHashtags,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },
  updateBlogs: async (req, res, next) => {
    try {
      const newsId = req.params.id;
      const updatedData = req.body;
      console.log(updatedData);

      const existingNews = await Blogs.findById(newsId);
      if (!existingNews) {
        return res.status(404).json({ msg: "Không tìm thấy tin tức" });
      }

      if (
        updatedData.img_cover &&
        existingNews.img_cover[0].id &&
        updatedData.img_cover[0].id !== existingNews.img_cover[0].id
      ) {
        if (existingNews.img_cover[0].id.startsWith("trungduc/")) {
          await services.delImg(existingNews.img_cover[0].id);
        }
      }

      const updatedNews = await Blogs.findByIdAndUpdate(newsId, updatedData, {
        new: true,
      });

      return res.status(200).json({
        msg: "Cập nhật tin tức thành công",
        news: updatedNews,
      });
    } catch (error) {
      console.error("Lỗi cập nhật tin tức:", error);
      return res
        .status(500)
        .json({ msg: "Lỗi hệ thống", error: error.message });
    }
  },
};
module.exports = BlogController;
