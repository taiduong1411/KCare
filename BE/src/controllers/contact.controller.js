const Contact = require("../model/contact.model");
const Service = require("../model/service.model"); // Import để populate hoạt động

const ContactController = {
  postContact: async (req, res, next) => {
    try {
      await Contact(req.body).save();
      return res.status(200).json({
        msg: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất !",
      });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
  getAllContact: async (req, res, next) => {
    try {
      const contacts = await Contact.find()
        .populate({
          path: "service",
          select: "name category basePrice",
          options: { strictPopulate: false },
        })
        .sort({ createdAt: -1 });

      console.log(
        "Sample contact with service:",
        JSON.stringify(contacts[0], null, 2)
      );
      return res.status(200).json(contacts);
    } catch (error) {
      console.error("Error getting contacts:", error);
      return res.status(500).json({ msg: "server error" });
    }
  },
  delContact: async (req, res, next) => {
    try {
      await Contact.findByIdAndDelete(req.params._id);
      return res.status(200).json({ msg: "Đã xoá thành công" });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
};
module.exports = ContactController;
