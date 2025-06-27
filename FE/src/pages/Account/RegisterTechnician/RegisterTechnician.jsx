import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiHome,
  FiTool,
  FiUser,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiUpload,
  FiCheckCircle,
  FiAward,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiClock,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import {
  FaTools,
  FaCreditCard,
  FaPercentage,
  FaMoneyBillWave,
  FaHandshake,
  FaRocket,
  FaGift,
} from "react-icons/fa";
import { MdOutlineEngineering, MdVerified, MdSecurity } from "react-icons/md";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { UserContext } from "../../../contexts/UserContext";
import { useNotification } from "../../../contexts/NotificationContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { getItems, addItems } from "../../../services/custom.api";

function RegisterTechnician() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const { userData } = useContext(UserContext);
  const { showNotification } = useNotification();
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
    getServices();
  }, []);
  const [serviceOptions, setServiceOptions] = useState([]);
  const getServices = async () => {
    const res = await getItems("admin/get-services");
    console.log("API Services response:", res.data); // Debug log
    setServiceOptions(res.data);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: userData?.fullName || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
      password: "",
      confirmPassword: "",
      idNumber: "",
      address: userData?.address || "",
      district: "",
      experience: "",
      bankName: "",
      bankAccount: "",
      bankOwner: "",
      agreedToTerms: false,
    },
  });

  const districts = [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Bình Thạnh",
    "Thủ Đức",
    "Gò Vấp",
    "Phú Nhuận",
    "Tân Bình",
    "Tân Phú",
    "Bình Tân",
    "Củ Chi",
    "Hóc Môn",
    "Bình Chánh",
    "Nhà Bè",
    "Cần Giờ",
  ];

  const benefits = [
    {
      icon: <FaMoneyBillWave className="text-3xl text-green-500" />,
      title: "Thu nhập cao",
      description: "70% hoa hồng mỗi đơn hàng + thưởng hiệu suất",
      color: "from-green-50 to-emerald-50 border-green-200",
    },
    {
      icon: <FiClock className="text-3xl text-blue-500" />,
      title: "Linh hoạt thời gian",
      description: "Tự do sắp xếp lịch làm việc theo ý muốn",
      color: "from-blue-50 to-cyan-50 border-blue-200",
    },
    {
      icon: <FaRocket className="text-3xl text-purple-500" />,
      title: "Phát triển sự nghiệp",
      description: "Đào tạo miễn phí & cơ hội thăng tiến",
      color: "from-purple-50 to-indigo-50 border-purple-200",
    },
    {
      icon: <MdSecurity className="text-3xl text-orange-500" />,
      title: "Bảo hiểm toàn diện",
      description: "Bảo hiểm tai nạn & hỗ trợ pháp lý",
      color: "from-orange-50 to-red-50 border-orange-200",
    },
  ];

  const stats = [
    { number: "70%", label: "Hoa hồng", icon: <FaPercentage /> },
    { number: "500K+", label: "Thu nhập/ngày", icon: <FiDollarSign /> },
    { number: "24/7", label: "Hỗ trợ", icon: <FiClock /> },
    { number: "98%", label: "Hài lòng", icon: <FiStar /> },
  ];

  const handleServiceToggle = (serviceId) => {
    console.log("Before toggle - selectedServices:", selectedServices);
    console.log("Toggling serviceId:", serviceId);

    setSelectedServices((prev) => {
      const isCurrentlySelected = prev.includes(serviceId);
      let newSelected;

      if (isCurrentlySelected) {
        // Remove from selection
        newSelected = prev.filter((id) => id !== serviceId);
      } else {
        // Add to selection
        newSelected = [...prev, serviceId];
      }

      console.log("After toggle - newSelected:", newSelected);
      return newSelected;
    });
  };

  const onSubmit = async (data) => {
    if (selectedServices.length === 0) {
      alert("Vui lòng chọn ít nhất một dịch vụ!");
      return;
    }

    try {
      setLoading(true);

      const technicianData = {
        // Personal Information
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        idNumber: data.idNumber,
        address: data.address,

        // Professional Information
        district: data.district,
        experience: data.experience,
        services: selectedServices, // Array of service IDs

        // Banking Information
        bankName: data.bankName,
        bankAccount: data.bankAccount,
        bankOwner: data.bankOwner,

        // Terms
        agreedToTerms: data.agreedToTerms,
      };

      const res = await addItems("account/register-technician", technicianData);
      if (res.status === 200) {
        showNotification("success", res.data.msg);
      } else {
        showNotification("error", res.data.msg);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showNotification("error", "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  const password = watch("password");

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden pt-32 lg:pt-36">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="text-white space-y-8" data-aos="fade-right">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 text-orange-300 px-6 py-3 rounded-full text-sm font-semibold">
                <FaRocket className="animate-bounce" />
                <span>Cơ hội nghề nghiệp vàng</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Trở thành
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                  Kỹ thuật viên
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  K-Care
                </span>
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                Gia nhập đội ngũ kỹ thuật viên chuyên nghiệp và bắt đầu hành
                trình
                <span className="text-orange-300 font-semibold">
                  {" "}
                  kiếm thu nhập cao
                </span>{" "}
                với
                <span className="text-cyan-300 font-semibold">
                  {" "}
                  thời gian linh hoạt
                </span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}>
                    <div className="text-2xl text-orange-400 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("register-form")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3">
                  <span>Đăng ký ngay</span>
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3">
                  <FiPhone />
                  <span>Tư vấn: 1900 xxxx</span>
                </button>
              </div>
            </div>

            {/* Right Content - Benefits */}
            <div className="space-y-6" data-aos="fade-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaGift className="text-orange-400" />
                  Quyền lợi đặc biệt
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}>
                      <div className="flex-shrink-0">{benefit.icon}</div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {benefit.title}
                        </h4>
                        <p className="text-blue-200 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div
        id="register-form"
        className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Form Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-6 shadow-2xl">
              <MdOutlineEngineering className="text-4xl text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700">
              Đăng ký ngay hôm nay
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Chỉ cần vài phút để hoàn thành đăng ký và bắt đầu kiếm tiền
            </p>
          </div>

          {/* Enhanced Commission Info */}
          <div
            className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-2xl p-8 mb-8 border border-green-200/50 shadow-xl"
            data-aos="fade-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaMoneyBillWave className="text-3xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Chính sách hoa hồng siêu hấp dẫn
                </h3>
                <p className="text-green-700">
                  Minh bạch - Công bằng - Cạnh tranh
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg border border-green-100">
                <div className="text-4xl font-black text-green-600 mb-2">
                  70%
                </div>
                <p className="text-gray-700 font-semibold">
                  Hoa hồng mỗi đơn hàng
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Cao nhất thị trường
                </p>
              </div>
              <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg border border-blue-100">
                <div className="text-4xl font-black text-blue-600 mb-2">
                  500K+
                </div>
                <p className="text-gray-700 font-semibold">
                  Thu nhập trung bình/ngày
                </p>
                <p className="text-sm text-gray-500 mt-1">Làm việc 6-8 tiếng</p>
              </div>
              <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg border border-orange-100">
                <div className="text-4xl font-black text-orange-600 mb-2">
                  <FaGift className="inline-block" />
                </div>
                <p className="text-gray-700 font-semibold">Thưởng hiệu suất</p>
                <p className="text-sm text-gray-500 mt-1">
                  Theo doanh số tháng
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden"
            data-aos="fade-up">
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FiUser className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Thông tin cá nhân
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          className={`w-full pl-12 pr-4 py-4 border-2 ${
                            errors.fullName
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                          placeholder="Nguyễn Văn A"
                          {...register("fullName", {
                            required: "Vui lòng nhập họ tên",
                            minLength: {
                              value: 2,
                              message: "Họ tên phải có ít nhất 2 ký tự",
                            },
                          })}
                        />
                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                      </div>
                      {errors.fullName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          className={`w-full pl-12 pr-4 py-4 border-2 ${
                            errors.phone
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                          placeholder="0901234567"
                          {...register("phone", {
                            required: "Vui lòng nhập số điện thoại",
                            pattern: {
                              value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                              message: "Số điện thoại không hợp lệ",
                            },
                          })}
                        />
                        <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          className={`w-full pl-12 pr-4 py-4 border-2 ${
                            errors.email
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                          placeholder="example@email.com"
                          {...register("email", {
                            required: "Vui lòng nhập email",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Email không hợp lệ",
                            },
                          })}
                        />
                        <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        CMND/CCCD <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          className={`w-full pl-12 pr-4 py-4 border-2 ${
                            errors.idNumber
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                          placeholder="001234567890"
                          {...register("idNumber", {
                            required: "Vui lòng nhập CMND/CCCD",
                            pattern: {
                              value: /^[0-9]{9,12}$/,
                              message: "CMND/CCCD không hợp lệ",
                            },
                          })}
                        />
                        <FiAward className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                      </div>
                      {errors.idNumber && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.idNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full pl-12 pr-4 py-4 border-2 ${
                          errors.address
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                        placeholder="123 Đường ABC, Phường XYZ"
                        {...register("address", {
                          required: "Vui lòng nhập địa chỉ",
                          minLength: {
                            value: 10,
                            message: "Địa chỉ phải có ít nhất 10 ký tự",
                          },
                        })}
                      />
                      <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    </div>
                    {errors.address && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span>⚠️</span> {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FaTools className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Thông tin chuyên môn
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Khu vực hoạt động{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`w-full px-4 py-4 border-2 ${
                          errors.district
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                        {...register("district", {
                          required: "Vui lòng chọn khu vực hoạt động",
                        })}>
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.district.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Kinh nghiệm <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          className={`w-full pl-12 pr-4 py-4 border-2 ${
                            errors.experience
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                          placeholder="VD: 3 năm sửa chữa điện lạnh"
                          {...register("experience", {
                            required: "Vui lòng nhập kinh nghiệm",
                            minLength: {
                              value: 10,
                              message: "Vui lòng mô tả chi tiết hơn",
                            },
                          })}
                        />
                        <FiBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                      </div>
                      {errors.experience && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.experience.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Dịch vụ đăng ký <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {serviceOptions.map((service) => {
                        const serviceId = service._id || service.id; // Support both _id and id
                        const isSelected = selectedServices.includes(serviceId);

                        return (
                          <label
                            key={serviceId}
                            className={`relative group cursor-pointer transition-all duration-300 ${
                              isSelected ? "scale-105" : "hover:scale-102"
                            }`}>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={isSelected}
                              onChange={() => {
                                console.log(
                                  "Toggling service:",
                                  serviceId,
                                  "Current selected:",
                                  selectedServices
                                );
                                handleServiceToggle(serviceId);
                              }}
                            />
                            <div
                              className={`
                              relative p-6 rounded-2xl border-2 text-center transition-all duration-300
                              ${
                                isSelected
                                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-transparent shadow-2xl"
                                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg text-gray-700"
                              }
                            `}>
                              <span className="text-3xl mb-3 block">🔧</span>
                              <span
                                className={`text-sm font-semibold block ${
                                  isSelected ? "text-white" : "text-gray-800"
                                }`}>
                                {service.name}
                              </span>
                              <div
                                className={`text-xs mt-1 ${
                                  isSelected ? "text-white/80" : "text-gray-500"
                                }`}>
                                {service.category}
                              </div>
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                  <FiCheckCircle className="text-white text-sm" />
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Banking Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <FaCreditCard className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Thông tin ngân hàng
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Tên ngân hàng <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-4 py-4 border-2 ${
                          errors.bankName
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                        placeholder="VD: Vietcombank"
                        {...register("bankName", {
                          required: "Vui lòng nhập tên ngân hàng",
                        })}
                      />
                      {errors.bankName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.bankName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Số tài khoản <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-4 py-4 border-2 ${
                          errors.bankAccount
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                        placeholder="1234567890"
                        {...register("bankAccount", {
                          required: "Vui lòng nhập số tài khoản",
                          pattern: {
                            value: /^[0-9]{8,20}$/,
                            message: "Số tài khoản không hợp lệ",
                          },
                        })}
                      />
                      {errors.bankAccount && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.bankAccount.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Chủ tài khoản <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-4 py-4 border-2 ${
                          errors.bankOwner
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 focus:border-blue-500"
                        } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                        placeholder="NGUYEN VAN A"
                        {...register("bankOwner", {
                          required: "Vui lòng nhập tên chủ tài khoản",
                        })}
                      />
                      {errors.bankOwner && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.bankOwner.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <FiLock className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Bảo mật tài khoản
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`w-full pl-12 pr-12 py-4 border-2 ${
                            errors.password
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                          placeholder="••••••••"
                          {...register("password", {
                            required: "Vui lòng nhập mật khẩu",
                            minLength: {
                              value: 6,
                              message: "Mật khẩu phải có ít nhất 6 ký tự",
                            },
                          })}
                        />
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl">
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Xác nhận mật khẩu{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`w-full pl-12 pr-12 py-4 border-2 ${
                            errors.confirmPassword
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-800 font-medium`}
                          placeholder="••••••••"
                          {...register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu",
                            validate: (value) =>
                              value === password ||
                              "Mật khẩu xác nhận không khớp",
                          })}
                        />
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl">
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span>⚠️</span> {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <input
                      id="agreedToTerms"
                      type="checkbox"
                      className={`h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 rounded mt-1 ${
                        errors.agreedToTerms
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("agreedToTerms", {
                        required: "Vui lòng đồng ý với điều khoản",
                      })}
                    />
                    <label
                      htmlFor="agreedToTerms"
                      className="text-sm text-gray-700 leading-relaxed">
                      Tôi đồng ý với{" "}
                      <Link
                        to="/terms-technician"
                        className="text-blue-600 hover:text-blue-700 font-semibold underline">
                        điều khoản hợp tác
                      </Link>{" "}
                      và{" "}
                      <Link
                        to="/commission-policy"
                        className="text-blue-600 hover:text-blue-700 font-semibold underline">
                        chính sách hoa hồng
                      </Link>{" "}
                      của KCare. Tôi cam kết cung cấp thông tin chính xác và
                      tuân thủ quy định của công ty.
                    </label>
                  </div>
                  {errors.agreedToTerms && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.agreedToTerms.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 px-8 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 transform hover:scale-[1.02]"
                  } text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 group`}>
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀 Đăng ký làm Kỹ thuật viên</span>
                      <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center pt-8 border-t border-gray-200 mt-8">
                <p className="text-gray-600">
                  Đã có tài khoản kỹ thuật viên?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700 underline">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default RegisterTechnician;
