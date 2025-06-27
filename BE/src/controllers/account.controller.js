const Accounts = require("../model/account.model");
const OTP = require("../model/otp.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const service = require("../services/email");
const Technician = require("../model/technician.model");
const AccountController = {
  register: async (req, res) => {
    try {
      const { email, password, fullName, phone, address } = req.body;
      // Kiểm tra email đã tồn tại
      const existingEmail = await Accounts.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ msg: "Email đã được sử dụng" });
      }

      // Kiểm tra số điện thoại đã tồn tại
      const existingPhone = await Accounts.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ msg: "Số điện thoại đã được sử dụng" });
      }

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Tạo tài khoản mới với role user
      const newAccount = new Accounts({
        email,
        password: hashedPassword,
        fullName,
        phone,
        address,
        role: "user",
        status: "active",
      });

      await newAccount.save();

      // Tạo token
      const token = jwt.sign({ id: newAccount._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        msg: "Đăng ký thành công",
        token,
        account: {
          id: newAccount._id,
          email: newAccount.email,
          fullName: newAccount.fullName,
          phone: newAccount.phone,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ msg: "Lỗi server" });
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const account = await Accounts.findOne({ email });
      if (!account) {
        return res.status(400).json({ msg: "Tài khoản không tồn tại" });
      }
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.status(400).json({ msg: "Mật khẩu không đúng" });
      }
      const token = jwt.sign(
        { id: account._id, role: account.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({ msg: "Đăng nhập thành công", token });
    } catch (error) {
      return res.status(500).json({ msg: "Lỗi server" });
    }
  },
  getUserInfo: async (req, res) => {
    const { id } = req.params;
    const account = await Accounts.findById(id);
    return res.status(200).json(account);
  },
  verifyEmail: async (req, res) => {
    try {
      const { email } = req.body;
      await Accounts.findOne({ email: email }).then(async (account) => {
        if (!account)
          return res.status(404).json({ msg: "Tài Khoản Không Tồn Tại" });

        // Delete all existing OTPs for the email
        await OTP.deleteMany({ email: email });

        // Generate new OTP
        const data = {
          code: service.randomCode(),
          email: email,
        };

        // Send the new OTP via email
        await service.sendEmail(data.code, data.email).then(() => {
          return res.status(200).json({
            msg: "OTP đã được gửi. Vui lòng kiểm tra email của bạn.",
          });
        });
        // Save the new OTP to the database
        await OTP(data).save();
      });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      await OTP.findOne({ email: req.body.email }).then(async (otp) => {
        if (!otp)
          return res
            .status(400)
            .json({ msg: "Mã Xác Thực Đã Hết Hiệu Lực Hoặc Không Tồn Tại" });
        if (otp.code !== req.body.code)
          return res.status(401).json({ msg: "Mã Xác Thực Không Đúng" });
        let user = await Accounts.findOne({ email: otp.email });
        const hash = bcrypt.hashSync(req.body.password, 5);
        user.password = hash;
        await user.save();
        return res.status(200).json({ msg: "Thay Đổi Mật Khẩu Thành Công" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
  updateUserInfo: async (req, res) => {
    const { fullName, phone, address, email, avatar } = req.body;
    const account = await Accounts.findOneAndUpdate(
      { email },
      {
        fullName,
        phone,
        address,
        avatar,
      }
    );
    if (!account)
      return res.status(400).json({ msg: "Cập nhật thông tin thất bại" });
    return res.status(200).json({
      msg: "Cập nhật thông tin thành công",
      account: account.email,
    });
  },
  registerTechnician: async (req, res) => {
    try {
      const {
        // Personal Information
        fullName,
        phone,
        email,
        password,
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

        // Terms
        agreedToTerms,
      } = req.body;

      // Validation
      if (!agreedToTerms) {
        return res.status(400).json({
          msg: "Vui lòng đồng ý với điều khoản hợp tác",
        });
      }

      if (!services || services.length === 0) {
        return res.status(400).json({
          msg: "Vui lòng chọn ít nhất một dịch vụ",
        });
      }

      // 1. Find existing account by email
      const existingAccount = await Accounts.findOne({ email });
      if (!existingAccount) {
        return res.status(400).json({
          msg: "Tài khoản không tồn tại. Vui lòng đăng ký tài khoản trước.",
        });
      }

      // 2. Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        existingAccount.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({
          msg: "Mật khẩu không đúng",
        });
      }

      // 3. Check if this account is already a technician
      const existingTechnician = await Technician.findOne({
        account: existingAccount._id,
      });
      if (existingTechnician) {
        return res.status(400).json({
          msg: "Tài khoản này đã được đăng ký làm kỹ thuật viên",
        });
      }

      // 4. Check if phone already exists in technician table
      const existingTechPhone = await Technician.findOne({ phone });
      if (existingTechPhone) {
        return res.status(400).json({
          msg: "Số điện thoại đã được đăng ký làm kỹ thuật viên",
        });
      }

      // 5. Check if ID number already exists
      const existingIdNumber = await Technician.findOne({ idNumber });
      if (existingIdNumber) {
        return res.status(400).json({
          msg: "CMND/CCCD đã được sử dụng",
        });
      }

      // 6. Check if bank account already exists
      const existingBankAccount = await Technician.findOne({ bankAccount });
      if (existingBankAccount) {
        return res.status(400).json({
          msg: "Số tài khoản ngân hàng đã được sử dụng",
        });
      }

      // 7. Create Technician profile linked to existing account
      const newTechnician = new Technician({
        // Reference to existing account
        account: existingAccount._id,

        // Personal Information (from form)
        fullName,
        phone,
        email,
        idNumber,
        address,

        // Professional Information
        district,
        experience,
        services, // Array of ObjectIds

        // Banking Information
        bankName,
        bankAccount,
        bankOwner,

        // Default status
        status: "pending", // Waiting for admin approval
        depositStatus: "pending", // Waiting for deposit payment
      });

      const savedTechnician = await newTechnician.save();

      await existingAccount.save();

      // 8. Send Email to technician
      await service.sendQRCodeTechnician(
        fullName,
        email,
        "https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png"
      );
      // 9. Populate services for response
      await savedTechnician.populate("services", "name category basePrice");

      return res.status(201).json({
        msg: "Đăng ký kỹ thuật viên thành công! Vui lòng chờ admin phê duyệt và thông báo về việc ký quỹ 1,000,000 VNĐ.",
        technician: {
          id: savedTechnician._id,
          fullName: savedTechnician.fullName,
          email: savedTechnician.email,
          phone: savedTechnician.phone,
          district: savedTechnician.district,
          services: savedTechnician.services,
          status: savedTechnician.status,
          depositStatus: savedTechnician.depositStatus,
          requiredDeposit: savedTechnician.requiredDeposit,
        },
      });
    } catch (error) {
      console.error("Register technician error:", error);

      // Handle validation errors
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          msg: "Dữ liệu không hợp lệ",
          errors,
        });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const fieldNames = {
          email: "Email",
          phone: "Số điện thoại",
          idNumber: "CMND/CCCD",
          bankAccount: "Số tài khoản ngân hàng",
        };
        return res.status(400).json({
          msg: `${fieldNames[field] || "Trường"} đã được sử dụng`,
        });
      }

      return res.status(500).json({
        msg: "Lỗi server khi đăng ký kỹ thuật viên",
      });
    }
  },
};

module.exports = AccountController;
