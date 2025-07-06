const Blogs = require("../model/blog.model");
const Accounts = require("../model/account.model");
const Service = require("../model/service.model");
const Contact = require("../model/contact.model");
const services = require("../services/email");
const Technician = require("../model/technician.model");
const bcrypt = require("bcrypt");
const AdminController = {
  createService: async (req, res) => {
    const {
      name,
      description,
      category,
      basePrice,
      duration,
      isActive,
      images,
      commissionRate,
    } = req.body;
    const service = new Service({
      name,
      description,
      category,
      basePrice,
      duration,
      isActive,
      images,
      commissionRate,
    });
    await service.save();
    return res.status(200).json({ msg: "Thêm dịch vụ thành công" });
  },
  getServices: async (req, res) => {
    const services = await Service.find();
    return res.status(200).json(services);
  },
  updateService: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      basePrice,
      duration,
      isActive,
      images,
      commissionRate,
    } = req.body;
    const service = await Service.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        basePrice,
        duration,
        isActive,
        images,
        commissionRate,
      },
      { new: true }
    );
    return res.status(200).json({ msg: "Cập nhật dịch vụ thành công" });
  },
  deleteService: async (req, res) => {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Xóa dịch vụ thành công" });
  },
  // contact
  replyCustomer: async (req, res, next) => {
    try {
      const { to, text, subject } = req.body;
      services.replyEmail(subject, text, to);
      await Contact.findOneAndUpdate({ email: to }).then((contact) => {
        contact.status = true;
        contact.save();
      });
      return res.status(200).json({ msg: "Email đã được gửi thành công" });
    } catch (error) {
      return res.status(500).json({ msg: "Có lỗi xảy ra. Vui lòng thử lại !" });
    }
  },
  // technician
  getAllTechnicians: async (req, res) => {
    const technicians = await Technician.find()
      .populate("services", "name category")
      .populate("account", "avatar");
    return res.status(200).json(technicians);
  },
  getActiveTechnicians: async (req, res) => {
    try {
      const technicians = await Technician.find({
        status: "active",
        depositStatus: "paid",
        "lockInfo.isLocked": { $ne: true },
      })
        .populate("services", "name category")
        .populate("account", "avatar fullName phone")
        .sort({ rating: -1, completedJobs: -1 });

      return res.status(200).json(technicians);
    } catch (error) {
      console.error("Error getting active technicians:", error);
      return res.status(500).json({
        msg: "Có lỗi xảy ra khi lấy danh sách kỹ thuật viên",
        error: error.message,
      });
    }
  },
  getTechnicianById: async (req, res) => {
    const { id } = req.params;
    const technician = await Technician.findById(id);
    return res.status(200).json(technician);
  },
  updateTechnician: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        fullName,
        idNumber,
        phone,
        address,
        district,
        experience,
        services,
        bankName,
        bankAccount,
        bankOwner,
      } = req.body;

      // Validate ObjectId
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: "ID kỹ thuật viên không hợp lệ" });
      }

      // Check if technician exists
      const existingTechnician = await Technician.findById(id);
      if (!existingTechnician) {
        return res.status(404).json({ msg: "Không tìm thấy kỹ thuật viên" });
      }

      // Validate services if provided
      if (services && services.length > 0) {
        const validServices = await Service.find({ _id: { $in: services } });
        if (validServices.length !== services.length) {
          return res.status(400).json({ msg: "Một số dịch vụ không hợp lệ" });
        }
      }

      // Prepare update data
      const updateData = {};
      if (fullName) updateData.fullName = fullName;
      if (idNumber) updateData.idNumber = idNumber;
      if (phone) updateData.phone = phone;
      if (address) updateData.address = address;
      if (district) updateData.district = district;
      if (experience) updateData.experience = experience;
      if (services) updateData.services = services;
      if (bankName) updateData.bankName = bankName;
      if (bankAccount) updateData.bankAccount = bankAccount;
      if (bankOwner) updateData.bankOwner = bankOwner;

      // Update technician
      const updatedTechnician = await Technician.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
        .populate("services", "name category")
        .populate("account", "email fullName avatar");

      return res.status(200).json({
        msg: "Cập nhật thông tin kỹ thuật viên thành công",
        technician: updatedTechnician,
      });
    } catch (error) {
      console.error("Update technician error:", error);
      return res
        .status(500)
        .json({ msg: "Có lỗi xảy ra khi cập nhật kỹ thuật viên" });
    }
  },
  deleteTechnician: async (req, res) => {
    const { id } = req.params;
    await Technician.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Xóa kỹ thuật viên thành công" });
  },
  approveTechnician: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: "ID kỹ thuật viên không hợp lệ" });
      }

      const technician = await Technician.findByIdAndUpdate(
        id,
        {
          status: "active",
          depositStatus: "paid", // Tự động đặt đã đóng cọc khi admin phê duyệt
          depositPaidAt: new Date(), // Ghi lại thời gian phê duyệt
        },
        { new: true }
      ).populate("account", "email fullName");

      if (!technician) {
        return res.status(404).json({ msg: "Không tìm thấy kỹ thuật viên" });
      }

      // Cập nhật role trong bảng account thành "technician"
      if (technician.account) {
        await Accounts.findByIdAndUpdate(
          technician.account._id,
          { role: "technician" },
          { new: true }
        );
      }

      // Gửi email thông báo duyệt thành công (optional - không bắt buộc)
      try {
        if (technician.account && technician.account.email) {
          await services.confirmTechnician(
            "Đăng ký Kỹ thuật viên được chấp thuận",
            `Chúc mừng! Hồ sơ kỹ thuật viên của bạn đã được duyệt thành công và đã được xử lý ký quỹ. Bạn có thể bắt đầu nhận đơn hàng ngay lập tức!`,
            technician.account.email
          );
        }
      } catch (emailError) {
        console.error("Email sending error (non-critical):", emailError);
        // Không trả về lỗi, chỉ log
      }

      return res.status(200).json({
        msg: "Duyệt kỹ thuật viên thành công",
        technician,
      });
    } catch (error) {
      console.error("Approve technician error:", error);
      return res
        .status(500)
        .json({ msg: "Có lỗi xảy ra khi duyệt kỹ thuật viên" });
    }
  },
  rejectTechnician: async (req, res) => {
    try {
      console.log("Reject technician request:", req.params, req.body);
      const { id } = req.params;
      const { reason } = req.body || {}; // Lý do từ chối (optional)

      // Validate ObjectId
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: "ID kỹ thuật viên không hợp lệ" });
      }

      const technician = await Technician.findByIdAndUpdate(
        id,
        { status: "rejected" },
        { new: true }
      ).populate("account", "email fullName");

      if (!technician) {
        return res.status(404).json({ msg: "Không tìm thấy kỹ thuật viên" });
      }

      // Cập nhật role trong bảng account về lại "user" khi từ chối
      if (technician.account) {
        await Accounts.findByIdAndUpdate(
          technician.account._id,
          { role: "user" },
          { new: true }
        );
      }

      // Gửi email thông báo từ chối (optional - không bắt buộc)
      try {
        if (technician.account && technician.account.email) {
          const rejectMessage = reason
            ? `Hồ sơ kỹ thuật viên của bạn đã bị từ chối với lý do: ${reason}. Vui lòng liên hệ admin để biết thêm chi tiết.`
            : `Hồ sơ kỹ thuật viên của bạn đã bị từ chối. Vui lòng liên hệ admin để biết thêm chi tiết.`;

          await services.rejectTechnician(
            "Đăng ký Kỹ thuật viên bị từ chối",
            rejectMessage,
            technician.account.email
          );
        }
      } catch (emailError) {
        console.error("Email sending error (non-critical):", emailError);
        // Không trả về lỗi, chỉ log
      }

      return res.status(200).json({
        msg: "Từ chối kỹ thuật viên thành công",
        technician,
      });
    } catch (error) {
      console.error("Reject technician error:", error);
      return res
        .status(500)
        .json({ msg: "Có lỗi xảy ra khi từ chối kỹ thuật viên" });
    }
  },
  suspendTechnician: async (req, res) => {
    try {
      console.log("Suspend technician request received:", req.params.id);
      const { id } = req.params;
      console.log("Suspend technician request received:", id);
      // Validate ObjectId
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: "ID kỹ thuật viên không hợp lệ" });
      }

      const technician = await Technician.findByIdAndUpdate(
        id,
        { status: "suspended" },
        { new: true }
      ).populate("account", "email fullName");

      if (!technician) {
        return res.status(404).json({ msg: "Không tìm thấy kỹ thuật viên" });
      }

      // Cập nhật role trong bảng account về "user" khi suspend
      if (technician.account) {
        await Accounts.findByIdAndUpdate(
          technician.account._id,
          { role: "user" },
          { new: true }
        );
      }

      return res.status(200).json({
        msg: "Tạm ngưng kỹ thuật viên thành công",
        technician,
      });
    } catch (error) {
      console.error("Suspend technician error:", error);
      return res
        .status(500)
        .json({ msg: "Có lỗi xảy ra khi tạm ngưng kỹ thuật viên" });
    }
  },
  banTechnician: async (req, res) => {
    try {
      console.log("Ban technician request received:", req.params);
      const { id } = req.params;

      // Validate ObjectId
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: "ID kỹ thuật viên không hợp lệ" });
      }

      const technician = await Technician.findByIdAndUpdate(
        id,
        { status: "banned" },
        { new: true }
      ).populate("account", "email fullName");

      if (!technician) {
        return res.status(404).json({ msg: "Không tìm thấy kỹ thuật viên" });
      }

      // Cập nhật status trong bảng account thành "banned" và role về "user"
      if (technician.account) {
        await Accounts.findByIdAndUpdate(
          technician.account._id,
          { status: "banned", role: "user" },
          { new: true }
        );
      }

      return res.status(200).json({
        msg: "Cấm tài khoản kỹ thuật viên thành công",
        technician,
      });
    } catch (error) {
      console.error("Ban technician error:", error);
      return res
        .status(500)
        .json({ msg: "Có lỗi xảy ra khi cấm tài khoản kỹ thuật viên" });
    }
  },
  activateTechnician: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: "ID kỹ thuật viên không hợp lệ" });
      }

      const technician = await Technician.findByIdAndUpdate(
        id,
        {
          status: "active",
          depositStatus: "paid", // Tự động đặt đã đóng cọc khi kích hoạt
          depositPaidAt: new Date(), // Ghi lại thời gian kích hoạt
        },
        { new: true }
      ).populate("account", "email fullName");

      if (!technician) {
        return res.status(404).json({ msg: "Không tìm thấy kỹ thuật viên" });
      }

      // Cập nhật role trong bảng account thành "technician" khi kích hoạt lại
      if (technician.account) {
        await Accounts.findByIdAndUpdate(
          technician.account._id,
          { role: "technician", status: "active" },
          { new: true }
        );
      }

      return res.status(200).json({
        msg: "Kích hoạt lại kỹ thuật viên thành công",
        technician,
      });
    } catch (error) {
      console.error("Activate technician error:", error);
      return res
        .status(500)
        .json({ msg: "Có lỗi xảy ra khi kích hoạt lại kỹ thuật viên" });
    }
  },
  unbanTechnician: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: "ID kỹ thuật viên không hợp lệ" });
      }

      const technician = await Technician.findByIdAndUpdate(
        id,
        {
          status: "active",
          depositStatus: "paid", // Tự động đặt đã đóng cọc khi bỏ cấm
          depositPaidAt: new Date(), // Ghi lại thời gian bỏ cấm
        },
        { new: true }
      ).populate("account", "email fullName");

      if (!technician) {
        return res.status(404).json({ msg: "Không tìm thấy kỹ thuật viên" });
      }

      // Cập nhật status và role trong bảng account khi bỏ cấm
      if (technician.account) {
        await Accounts.findByIdAndUpdate(
          technician.account._id,
          { status: "active", role: "technician" },
          { new: true }
        );
      }

      return res.status(200).json({
        msg: "Bỏ cấm kỹ thuật viên thành công",
        technician,
      });
    } catch (error) {
      console.error("Unban technician error:", error);
      return res
        .status(500)
        .json({ msg: "Có lỗi xảy ra khi bỏ cấm kỹ thuật viên" });
    }
  },
  createTechnician: async (req, res) => {
    try {
      const {
        // Personal Information
        fullName,
        phone,
        email,
        password: inputPassword,
        idNumber,
        address,

        // Professional Information
        district,
        experience,
        services, // Array of service IDs

        // Banking Information
        bankName,
        bankAccount,
        bankOwner,
      } = req.body;

      // Sử dụng password mặc định abc123
      let password = "abc123";

      console.log("Create technician request:", req.body);

      // Validate required fields
      if (
        !fullName ||
        !email ||
        !phone ||
        !district ||
        !experience ||
        !services ||
        services.length === 0
      ) {
        return res.status(400).json({
          msg: "Vui lòng điền đầy đủ thông tin bắt buộc",
        });
      }

      // Check if email or phone already exists in accounts
      const existingAccountByEmail = await Accounts.findOne({ email });
      const existingAccountByPhone = await Accounts.findOne({ phone });
      let accountId;

      // Kiểm tra nếu email hoặc phone đã được sử dụng bởi account khác
      if (
        existingAccountByEmail &&
        existingAccountByPhone &&
        existingAccountByEmail._id.toString() !==
          existingAccountByPhone._id.toString()
      ) {
        return res.status(400).json({
          msg: "Email và số điện thoại thuộc về các tài khoản khác nhau",
        });
      }

      const existingAccount = existingAccountByEmail || existingAccountByPhone;

      if (existingAccount) {
        // Nếu tài khoản đã tồn tại, kiểm tra xem đã là technician chưa
        const existingTechnician = await Technician.findOne({
          account: existingAccount._id,
        });
        if (existingTechnician) {
          return res.status(400).json({
            msg: "Tài khoản này đã được đăng ký làm kỹ thuật viên",
          });
        }

        // Sử dụng tài khoản hiện có
        accountId = existingAccount._id;

        // Cập nhật thông tin account (sử dụng .save() để trigger pre-save middleware)
        const accountToUpdate = await Accounts.findById(accountId);
        accountToUpdate.role = "technician";
        accountToUpdate.password = password; // Sẽ được hash bởi pre-save middleware
        accountToUpdate.fullName = fullName;
        accountToUpdate.email = email;
        accountToUpdate.phone = phone;
        accountToUpdate.address = address;
        await accountToUpdate.save();
      } else {
        // Tạo tài khoản mới nếu chưa tồn tại với password mặc định
        const newAccount = new Accounts({
          fullName,
          email,
          password: password, // Sẽ được hash bởi pre-save middleware
          phone,
          address,
          role: "technician",
          status: "active",
        });

        const savedAccount = await newAccount.save();
        accountId = savedAccount._id;
      }

      // Validate services exist
      const validServices = await Service.find({ _id: { $in: services } });
      if (validServices.length !== services.length) {
        return res.status(400).json({
          msg: "Một hoặc nhiều dịch vụ không hợp lệ",
        });
      }

      // Tạo technician profile
      const newTechnician = new Technician({
        fullName,
        phone,
        email,
        idNumber,
        address,
        district,
        experience,
        services, // Array of service IDs

        // Banking info
        bankName,
        bankAccount,
        bankOwner,

        // Account reference
        account: accountId,

        // Admin tạo thì tự động active và đã đóng cọc
        status: "active",
        depositStatus: "paid", // Tự động đặt đã đóng cọc khi admin tạo
        depositPaidAt: new Date(), // Ghi lại thời gian tạo
        depositAmount: 1000000, // 1 triệu VNĐ

        // Default values
        rating: 5.0,
        completedJobs: 0,
        totalEarnings: 0,
      });

      await newTechnician.save();

      // Gửi email thông báo tài khoản
      try {
        const emailSubject = "Tài khoản Kỹ thuật viên K-Care đã được tạo";
        const emailContent = `
            Chào ${fullName},

            Tài khoản kỹ thuật viên của bạn đã được tạo thành công bởi Admin K-Care.

            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            📧 THÔNG TIN ĐĂNG NHẬP
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            Email: ${email}
            Mật khẩu: ${password}

            ⚠️ QUAN TRỌNG: Vui lòng đổi mật khẩu ngay sau khi đăng nhập lần đầu để bảo mật tài khoản.

            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ✅ TRẠNG THÁI TÀI KHOẢN
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            🎯 Trạng thái: HOẠT ĐỘNG
            💰 Ký quỹ: ĐÃ XỬ LÝ
            🚀 Bạn có thể bắt đầu nhận đơn hàng ngay lập tức!

            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            🎯 BƯỚC TIẾP THEO
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            1. Đăng nhập vào hệ thống
            2. Đổi mật khẩu mới
            3. Hoàn thiện hồ sơ cá nhân
            4. Bắt đầu nhận đơn hàng

            Chúc bạn thành công và kiếm được thu nhập cao cùng K-Care!

            Trân trọng,
            Đội ngũ K-Care
        `;

        await services.confirmTechnician(emailSubject, emailContent, email);
        console.log(`Email sent successfully to ${email}`);
      } catch (emailError) {
        console.error("Email sending error (non-critical):", emailError);
      }

      return res.status(200).json({
        msg: "Tạo kỹ thuật viên thành công",
        technician: {
          id: newTechnician._id,
          fullName: newTechnician.fullName,
          email: newTechnician.email,
          status: newTechnician.status,
        },
      });
    } catch (error) {
      console.error("Create technician error:", error);

      // Handle specific mongoose errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          msg: `${field === "email" ? "Email" : field} đã được sử dụng`,
        });
      }

      return res.status(500).json({
        msg: "Có lỗi xảy ra khi tạo kỹ thuật viên",
      });
    }
  },
};
module.exports = AdminController;
