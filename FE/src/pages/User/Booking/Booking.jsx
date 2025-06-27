import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiUser,
  FiMail,
  FiFileText,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiHome,
  FiTool,
  FiDollarSign,
  FiInfo,
  FiShield,
  FiCamera,
  FiUpload,
  FiX,
  FiEdit3,
  FiSend,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiStar,
  FiCpu,
} from "react-icons/fi";
import { FaSnowflake, FaTv, FaFan, FaFireAlt, FaTools } from "react-icons/fa";
import {
  MdKitchen,
  MdLocalLaundryService,
  MdMicrowave,
  MdWaterDrop,
  MdPayment,
  MdVerified,
  MdLocationOn,
  MdAccessTime,
} from "react-icons/md";
import { BiTime, BiMoney } from "react-icons/bi";

function Booking() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const [currentView, setCurrentView] = useState("create"); // 'create' or 'browse'
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    urgency: "normal",
    budget: "",
    budgetType: "fixed", // fixed, hourly, negotiable
    location: "",
    district: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    preferredTime: "",
    images: [],
  });

  // Mock data for existing job posts
  const [jobPosts, setJobPosts] = useState([
    {
      id: 1,
      title: "Sửa máy lạnh không lạnh tại quận 1",
      category: "Sửa máy lạnh",
      description:
        "Máy lạnh toshiba 1.5HP không lạnh, có thổi gió nhưng không mát. Cần thợ có kinh nghiệm đến xem và sửa chữa.",
      urgency: "urgent",
      budget: "300.000",
      budgetType: "fixed",
      location: "123 Nguyễn Huệ, Quận 1",
      district: "Quận 1",
      contactName: "Nguyễn Văn A",
      contactPhone: "0909123456",
      timePosted: "2 giờ trước",
      applications: 5,
      views: 23,
      status: "open",
      images: [],
    },
    {
      id: 2,
      title: "Sửa tủ lạnh bị chảy nước",
      category: "Sửa tủ lạnh",
      description:
        "Tủ lạnh Samsung 2 cánh bị chảy nước dưới đáy, ngăn đá đóng băng quá nhiều. Cần thợ đến kiểm tra và sửa chữa.",
      urgency: "normal",
      budget: "500.000",
      budgetType: "negotiable",
      location: "456 Lê Lợi, Quận 3",
      district: "Quận 3",
      contactName: "Trần Thị B",
      contactPhone: "0909654321",
      timePosted: "5 giờ trước",
      applications: 3,
      views: 15,
      status: "open",
      images: [],
    },
    {
      id: 3,
      title: "Bảo trì máy giặt định kỳ",
      category: "Sửa máy giặt",
      description:
        "Cần thợ đến bảo trì máy giặt LG 9kg, vệ sinh lồng giặt và kiểm tra tổng thể. Có thể làm định kỳ hàng tháng.",
      urgency: "normal",
      budget: "80.000",
      budgetType: "hourly",
      location: "789 Võ Văn Tần, Quận 10",
      district: "Quận 10",
      contactName: "Lê Văn C",
      contactPhone: "0909789123",
      timePosted: "1 ngày trước",
      applications: 8,
      views: 42,
      status: "open",
      images: [],
    },
  ]);

  const services = [
    {
      id: 1,
      name: "Sửa máy lạnh",
      icon: <FaSnowflake className="text-2xl" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      name: "Sửa tủ lạnh",
      icon: <MdKitchen className="text-2xl" />,
      color: "from-cyan-400 to-cyan-600",
    },
    {
      id: 3,
      name: "Sửa máy giặt",
      icon: <MdLocalLaundryService className="text-2xl" />,
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 4,
      name: "Sửa tivi",
      icon: <FaTv className="text-2xl" />,
      color: "from-orange-400 to-orange-600",
    },
    {
      id: 5,
      name: "Sửa máy nước nóng",
      icon: <FaFireAlt className="text-2xl" />,
      color: "from-red-400 to-red-600",
    },
    {
      id: 6,
      name: "Sửa lò vi sóng",
      icon: <MdMicrowave className="text-2xl" />,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: 7,
      name: "Sửa quạt điện",
      icon: <FaFan className="text-2xl" />,
      color: "from-green-400 to-green-600",
    },
    {
      id: 8,
      name: "Bảo trì định kỳ",
      icon: <FaTools className="text-2xl" />,
      color: "from-gray-500 to-gray-700",
    },
  ];

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
    "Nhà Bè",
    "Hóc Môn",
    "Củ Chi",
    "Cần Giờ",
  ];

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      alert("Chỉ được tải lên tối đa 5 ảnh");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      ...formData,
      images: selectedImages,
      timePosted: "Vừa xong",
      applications: 0,
      views: 0,
      status: "open",
    };

    setJobPosts((prev) => [newPost, ...prev]);

    // Reset form
    setFormData({
      title: "",
      category: "",
      description: "",
      urgency: "normal",
      budget: "",
      budgetType: "fixed",
      location: "",
      district: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      preferredTime: "",
      images: [],
    });
    setSelectedImages([]);
    setCurrentView("browse");
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "Khẩn cấp";
      case "high":
        return "Ưu tiên cao";
      case "normal":
        return "Bình thường";
      case "low":
        return "Không gấp";
      default:
        return "Bình thường";
    }
  };

  const getBudgetTypeText = (budgetType) => {
    switch (budgetType) {
      case "fixed":
        return "Giá cố định";
      case "hourly":
        return "/giờ";
      case "negotiable":
        return "Thương lượng";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-32 lg:pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
              <FiTool className="w-4 h-4" />
              <span>Nền tảng kết nối thợ sửa chữa</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Đăng việc tìm <span className="text-yellow-300">thợ giỏi</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Đăng bài mô tả công việc sửa chữa của bạn và để các kỹ thuật viên
              chuyên nghiệp liên hệ nhận việc
            </p>

            {/* Toggle Buttons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setCurrentView("create")}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  currentView === "create"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}>
                <FiEdit3 className="inline mr-2" />
                Đăng việc mới
              </button>
              <button
                onClick={() => setCurrentView("browse")}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  currentView === "browse"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}>
                <FiEye className="inline mr-2" />
                Xem việc đã đăng
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Create Job Post Form */}
          {currentView === "create" && (
            <div className="max-w-4xl mx-auto">
              <div
                className="bg-white rounded-2xl shadow-xl p-8"
                data-aos="fade-up">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Đăng công việc sửa chữa
                  </h2>
                  <p className="text-gray-600">
                    Mô tả chi tiết công việc để thu hút các kỹ thuật viên phù
                    hợp
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <FiInfo className="text-blue-600" />
                      Thông tin cơ bản
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tiêu đề công việc *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="VD: Sửa máy lạnh không lạnh tại quận 1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Danh mục dịch vụ *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option value="">Chọn danh mục</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.name}>
                              {service.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mức độ ưu tiên *
                        </label>
                        <select
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option value="low">Không gấp</option>
                          <option value="normal">Bình thường</option>
                          <option value="high">Ưu tiên cao</option>
                          <option value="urgent">Khẩn cấp</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mô tả chi tiết công việc *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Mô tả chi tiết về vấn đề cần sửa chữa, tình trạng thiết bị, yêu cầu kỹ thuật viên..."></textarea>
                    </div>
                  </div>

                  {/* Budget Information */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <BiMoney className="text-green-600" />
                      Thông tin ngân sách
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Loại ngân sách *
                        </label>
                        <select
                          name="budgetType"
                          value={formData.budgetType}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option value="fixed">Giá cố định</option>
                          <option value="hourly">Theo giờ</option>
                          <option value="negotiable">Thương lượng</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ngân sách dự kiến
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={
                            formData.budgetType === "negotiable"
                              ? "Để trống nếu thương lượng"
                              : "VD: 300000"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <MdLocationOn className="text-blue-600" />
                      Thông tin địa điểm
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Địa chỉ cụ thể *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Số nhà, tên đường"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Quận/Huyện *
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                          <option value="">Chọn quận/huyện</option>
                          {districts.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Thời gian mong muốn
                      </label>
                      <input
                        type="text"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="VD: Sáng thứ 2-6, cuối tuần, tối sau 18h..."
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <FiUser className="text-purple-600" />
                      Thông tin liên hệ
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="0909 xxx xxx"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <FiCamera className="text-orange-600" />
                      Hình ảnh minh họa (Tối đa 5 ảnh)
                    </h3>

                    <div className="space-y-4">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">
                              Click để tải ảnh
                            </span>{" "}
                            hoặc kéo thả
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG (MAX. 5MB mỗi ảnh)
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>

                      {selectedImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {selectedImages.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt="Preview"
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <FiSend className="w-5 h-5" />
                      Đăng việc ngay
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Browse Job Posts */}
          {currentView === "browse" && (
            <div>
              <div className="text-center mb-8" data-aos="fade-up">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Công việc đã đăng
                </h2>
                <p className="text-gray-600">
                  Danh sách các công việc sửa chữa đang chờ kỹ thuật viên nhận
                </p>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                data-aos="fade-up">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiFileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {jobPosts.length}
                      </p>
                      <p className="text-sm text-gray-600">Việc đã đăng</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {jobPosts.filter((job) => job.status === "open").length}
                      </p>
                      <p className="text-sm text-gray-600">Đang mở</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {jobPosts.reduce(
                          (sum, job) => sum + job.applications,
                          0
                        )}
                      </p>
                      <p className="text-sm text-gray-600">Ứng tuyển</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FiEye className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {jobPosts.reduce((sum, job) => sum + job.views, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Lượt xem</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Posts List */}
              <div className="space-y-6">
                {jobPosts.map((job, index) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}>
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
                                job.urgency
                              )}`}>
                              {getUrgencyText(job.urgency)}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                              {job.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              {job.timePosted}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                            {job.title}
                          </h3>

                          <p className="text-gray-600 leading-relaxed mb-4">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MdLocationOn className="w-4 h-4" />
                              {job.location}, {job.district}
                            </span>
                            {job.preferredTime && (
                              <span className="flex items-center gap-1">
                                <MdAccessTime className="w-4 h-4" />
                                {job.preferredTime}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="lg:ml-8 mt-4 lg:mt-0">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {job.budget
                                ? `${parseInt(job.budget).toLocaleString()}đ`
                                : "Thương lượng"}
                              <span className="text-sm font-normal text-gray-500 ml-1">
                                {job.budgetType !== "negotiable" &&
                                  getBudgetTypeText(job.budgetType)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                              Ngân sách dự kiến
                            </p>

                            <button className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                              Nhận việc ngay
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Footer Stats */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiEye className="w-4 h-4" />
                            {job.views} lượt xem
                          </span>
                          <span className="flex items-center gap-1">
                            <FiUser className="w-4 h-4" />
                            {job.applications} ứng tuyển
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Liên hệ:</span>
                          <a
                            href={`tel:${job.contactPhone}`}
                            className="text-blue-600 hover:text-blue-700 font-medium">
                            {job.contactPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn KCare?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nền tảng kết nối đáng tin cậy giữa khách hàng và kỹ thuật viên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center" data-aos="fade-up">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiTime className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Phản hồi nhanh
              </h3>
              <p className="text-sm text-gray-600">
                Kỹ thuật viên phản hồi trong vòng 30 phút
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdVerified className="text-2xl text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                KTV đã xác minh
              </h3>
              <p className="text-sm text-gray-600">
                Tất cả kỹ thuật viên đều được xác minh kỹ năng
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="text-2xl text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Giá cạnh tranh
              </h3>
              <p className="text-sm text-gray-600">
                So sánh nhiều báo giá để chọn phù hợp
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-2xl text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Bảo hành chất lượng
              </h3>
              <p className="text-sm text-gray-600">
                Cam kết bảo hành và hỗ trợ sau dịch vụ
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Booking;
