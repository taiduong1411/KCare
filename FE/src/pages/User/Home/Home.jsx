import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion"; // Removed as package is not installed
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FiCheckCircle,
  FiPhone,
  FiClock,
  FiShield,
  FiHome,
  FiTool,
  FiCalendar,
  FiUsers,
  FiStar,
  FiArrowRight,
  FiDollarSign,
  FiMapPin,
  FiAward,
  FiTrendingUp,
  FiPackage,
  FiHeadphones,
} from "react-icons/fi";
import {
  FaSnowflake,
  FaTv,
  FaFan,
  FaFireAlt,
  FaHandshake,
  FaWarehouse,
} from "react-icons/fa";
import {
  MdKitchen,
  MdLocalLaundryService,
  MdMicrowave,
  MdWaterDrop,
  MdVerified,
  MdSpeed,
  MdSecurity,
} from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import BrandPartners from "../../../components/BrandPartners/BrandPartners";

// Import mock data
import { getPopularServices } from "../../../mocks/services";
import { getLatestTestimonials } from "../../../mocks/testimonials";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      delay: 100,
    });

    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Get data from mocks
  const services = getPopularServices();
  const testimonials = getLatestTestimonials(3);

  // Icon mapping
  const iconMap = {
    FaSnowflake: <FaSnowflake className="text-4xl" />,
    MdKitchen: <MdKitchen className="text-4xl" />,
    MdLocalLaundryService: <MdLocalLaundryService className="text-4xl" />,
    FaTv: <FaTv className="text-4xl" />,
    FaFireAlt: <FaFireAlt className="text-4xl" />,
    MdMicrowave: <MdMicrowave className="text-4xl" />,
    FaFan: <FaFan className="text-4xl" />,
    MdWaterDrop: <MdWaterDrop className="text-4xl" />,
  };

  const process = [
    {
      step: "01",
      title: "Đặt lịch hẹn",
      description: "Liên hệ hotline hoặc đặt lịch online",
      icon: <FiCalendar />,
    },
    {
      step: "02",
      title: "Kỹ thuật viên đến nhà",
      description: "Đúng giờ hẹn, mang đầy đủ dụng cụ",
      icon: <FiHome />,
    },
    {
      step: "03",
      title: "Kiểm tra & báo giá",
      description: "Kiểm tra miễn phí, báo giá trước khi làm",
      icon: <FiTool />,
    },
    {
      step: "04",
      title: "Thực hiện dịch vụ",
      description: "Tiến hành sửa chữa, bảo trì chuyên nghiệp",
      icon: <FiCheckCircle />,
    },
  ];

  const stats = [
    { number: "50K+", label: "Khách hàng tin tưởng", icon: <FiUsers /> },
    { number: "100+", label: "Kỹ thuật viên", icon: <FaHandshake /> },
    { number: "24/7", label: "Phục vụ khẩn cấp", icon: <FiClock /> },
    { number: "98%", label: "Khách hàng hài lòng", icon: <FiStar /> },
  ];

  const emergencyServices = [
    {
      title: "Sửa chữa khẩn cấp 24/7",
      description: "Hỗ trợ sự cố gấp mọi lúc, mọi nơi",
      icon: <MdSpeed className="text-3xl" />,
      color: "from-red-400 to-red-600",
    },
    {
      title: "Đội ngũ chuyên nghiệp",
      description: "KTV có chứng chỉ, kinh nghiệm lâu năm",
      icon: <MdVerified className="text-3xl" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Cam kết chất lượng",
      description: "Bảo hành dài hạn, hỗ trợ sau dịch vụ",
      icon: <MdSecurity className="text-3xl" />,
      color: "from-green-400 to-green-600",
    },
  ];

  const pricingPlans = [
    {
      name: "Gói Cơ bản",
      price: "Theo dịch vụ",
      features: [
        "Kiểm tra miễn phí",
        "Báo giá trước khi làm",
        "Bảo hành 3 tháng",
        "Thanh toán sau dịch vụ",
      ],
      recommended: false,
    },
    {
      name: "Gói Gia đình",
      price: "2.999.000đ/năm",
      features: [
        "Bảo trì định kỳ 4 lần/năm",
        "Giảm 20% phí sửa chữa",
        "Ưu tiên phục vụ",
        "Bảo hành 6 tháng",
        "Hotline riêng 24/7",
      ],
      recommended: true,
    },
    {
      name: "Gói Doanh nghiệp",
      price: "Liên hệ",
      features: [
        "Bảo trì theo hợp đồng",
        "Giảm 30% phí sửa chữa",
        "Phục vụ ưu tiên cao",
        "Bảo hành 12 tháng",
        "Quản lý riêng",
      ],
      recommended: false,
    },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "5 dấu hiệu máy lạnh cần được vệ sinh",
      excerpt:
        "Máy lạnh không mát, có mùi lạ, tiếng ồn bất thường... là những dấu hiệu cảnh báo",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      category: "Máy lạnh",
      date: "15/03/2024",
      readTime: "5 phút",
    },
    {
      id: 2,
      title: "Cách tiết kiệm điện khi dùng tủ lạnh",
      excerpt:
        "Những mẹo đơn giản giúp tủ lạnh hoạt động hiệu quả và tiết kiệm điện năng",
      image:
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
      category: "Tủ lạnh",
      date: "12/03/2024",
      readTime: "3 phút",
    },
    {
      id: 3,
      title: "Bảo dưỡng máy giặt đúng cách",
      excerpt: "Hướng dẫn chi tiết cách vệ sinh và bảo dưỡng máy giặt tại nhà",
      image:
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400",
      category: "Máy giặt",
      date: "10/03/2024",
      readTime: "4 phút",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-600 font-medium animate-pulse">
              Đang tải...
            </p>
          </div>
        </div>
      )}
      <Header />

      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-32 lg:pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
        </div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-8" data-aos="fade-right">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/50 text-emerald-700 px-6 py-3 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-lg">🎉</span>
                <span>Ưu đãi đặc biệt - Giảm 20% cho khách hàng mới</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                  Dịch vụ
                </span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-black">
                  bảo trì
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                  thiết bị điện
                </span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-black">
                  tại nhà
                </span>
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 font-black">
                  chuyên nghiệp #1
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
                Đội ngũ kỹ thuật viên được chứng nhận quốc tế, phục vụ 24/7 với
                cam kết
                <span className="text-blue-600 font-semibold">
                  {" "}
                  chất lượng vượt trội
                </span>{" "}
                và
                <span className="text-emerald-600 font-semibold">
                  {" "}
                  giá cả minh bạch
                </span>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to="/booking"
                  className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-lg">Đặt lịch ngay</span>
                  <FiArrowRight className="relative z-10 text-xl group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <a
                  href="tel:1900xxxx"
                  className="group px-10 py-5 bg-white/90 backdrop-blur-sm text-indigo-700 font-bold rounded-2xl border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl">
                  <FiPhone className="text-xl animate-pulse group-hover:scale-110 transition-transform" />
                  <span className="text-lg">1900 xxxx</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-6">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-emerald-200/50">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="text-emerald-600 text-lg" />
                  </div>
                  <span className="text-slate-700 font-semibold">
                    Miễn phí kiểm tra
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-blue-200/50">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiShield className="text-blue-600 text-lg" />
                  </div>
                  <span className="text-slate-700 font-semibold">
                    Bảo hành dài hạn
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-purple-200/50">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiMapPin className="text-purple-600 text-lg" />
                  </div>
                  <span className="text-slate-700 font-semibold">
                    Phục vụ toàn TP.HCM
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-12 lg:mt-0" data-aos="fade-left">
              <div className="relative z-10">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                  <img
                    src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700"
                    alt="Technician at work"
                    className="w-full object-cover h-[400px] md:h-[500px] lg:h-[600px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div
                  className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-blue-100"
                  data-aos="zoom-in"
                  data-aos-delay="200">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <FiUsers className="text-3xl text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-slate-900">50K+</p>
                      <p className="text-slate-600 font-semibold">
                        Khách hàng tin tưởng
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-amber-100"
                  data-aos="zoom-in"
                  data-aos-delay="300">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="text-amber-500 fill-amber-500 text-lg"
                        />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900">
                        4.9/5
                      </p>
                      <p className="text-slate-600 text-sm font-semibold">
                        (2K+ đánh giá)
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute top-1/2 -right-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-2xl p-6"
                  data-aos="zoom-in"
                  data-aos-delay="400">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiCheckCircle className="text-2xl" />
                    </div>
                    <p className="text-lg font-bold">98%</p>
                    <p className="text-sm font-medium">Hài lòng</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Tại sao chọn K-Care?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Cam kết mang đến dịch vụ tốt nhất với chất lượng vượt trội
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {emergencyServices.map((service, index) => (
              <div
                key={index}
                className="group text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl mb-6 transform transition-transform duration-300 group-hover:scale-110 shadow-2xl border border-white/20">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-200 transition-colors">
                  {service.title}
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.05)_0%,transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <span>⚡</span>
              Dịch vụ chuyên nghiệp
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 leading-tight">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Cung cấp đầy đủ dịch vụ bảo trì, vệ sinh, sửa chữa cho mọi thiết
              bị điện gia dụng với{" "}
              <span className="text-blue-600 font-semibold">
                công nghệ hiện đại
              </span>{" "}
              và
              <span className="text-emerald-600 font-semibold">
                quy trình chuẩn quốc tế
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-slate-200/50 hover:border-blue-300/50 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <div className="p-8 sm:p-10">
                  <div className="relative mb-8">
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${service.color} rounded-3xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-2xl border border-white/50 relative z-10`}>
                      {iconMap[service.icon]}
                    </div>
                    <div
                      className={`absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${service.color} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500 font-medium">
                        Giá từ
                      </span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {service.price.from.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                      <span>Xem chi tiết</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
                <div
                  className={`h-2 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/services"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">Xem tất cả dịch vụ</span>
              <FiArrowRight className="relative z-10 text-xl group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div data-aos="fade-right">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                Tại sao chọn KCare?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiClock className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Phản hồi nhanh chóng
                    </h4>
                    <p className="text-gray-600">
                      Tiếp nhận và phản hồi yêu cầu trong vòng 30 phút. Có mặt
                      tại nhà khách hàng đúng giờ hẹn.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiShield className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Bảo hành dài hạn
                    </h4>
                    <p className="text-gray-600">
                      Cam kết bảo hành dịch vụ lên đến 12 tháng. Hỗ trợ kỹ thuật
                      miễn phí sau bảo trì.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiUsers className="text-violet-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Đội ngũ chuyên nghiệp
                    </h4>
                    <p className="text-gray-600">
                      Kỹ thuật viên được đào tạo bài bản, có chứng chỉ và kinh
                      nghiệm thực tế cao.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FiStar className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Giá cả minh bạch
                    </h4>
                    <p className="text-gray-600">
                      Báo giá trước khi thực hiện. Không phát sinh chi phí.
                      Thanh toán linh hoạt.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0" data-aos="fade-left">
              <img
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600"
                alt="Professional technician"
                className="rounded-2xl shadow-2xl w-full object-cover h-[350px] md:h-[400px] lg:h-auto border-4 border-white"
                loading="lazy"
              />
              <div
                className="absolute -top-6 -right-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl p-6 shadow-xl border border-white/20"
                data-aos="zoom-in"
                data-aos-delay="200">
                <p className="text-4xl font-bold">98%</p>
                <p className="text-sm">Khách hàng hài lòng</p>
              </div>
              <div
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl border-2 border-blue-50"
                data-aos="zoom-in"
                data-aos-delay="300">
                <div className="flex items-center gap-3">
                  <FiAward className="text-3xl text-amber-500" />
                  <div>
                    <p className="font-bold text-gray-900">Top 1</p>
                    <p className="text-sm text-gray-600">Dịch vụ uy tín 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              Gói dịch vụ phù hợp với bạn
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lựa chọn gói dịch vụ phù hợp với nhu cầu của gia đình hoặc doanh
              nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 ${
                  plan.recommended
                    ? "ring-2 ring-blue-600 transform scale-105"
                    : ""
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                      Phổ biến nhất
                    </span>
                  </div>
                )}
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {plan.price}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FiCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                    plan.recommended
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}>
                  Chọn gói này
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Enhanced */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              Quy trình làm việc
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              4 bước đơn giản để được phục vụ tại nhà
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {process.map((item, index) => (
              <div
                key={index}
                className="relative"
                data-aos="fade-up"
                data-aos-delay={index * 150}>
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-blue-200 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="text-6xl font-bold text-gray-100 mb-4">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 shadow-lg border border-white/50">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <FiArrowRight className="text-3xl text-indigo-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partners Section */}
      <BrandPartners />

      {/* Stats Section - Enhanced */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div
            className="w-full h-full bg-repeat bg-[length:60px_60px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Thành tích ấn tượng
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Những con số minh chứng cho chất lượng dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group text-center bg-white/5 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/20 hover:-translate-y-2"
                data-aos="zoom-in"
                data-aos-delay={index * 100}>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl border border-white/20">
                  <div className="text-3xl">{stat.icon}</div>
                </div>
                <p className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </p>
                <p className="text-blue-100 text-lg font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.05)_0%,transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <span>⭐</span>
              Đánh giá từ khách hàng
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 leading-tight">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ
              <span className="text-emerald-600 font-semibold">
                {" "}
                chất lượng cao
              </span>{" "}
              của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative border border-slate-200/50 hover:border-blue-300/50 overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <div className="absolute top-6 right-6 text-8xl text-slate-200/50 font-serif leading-none">
                  "
                </div>
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="fill-amber-400 text-amber-400 text-xl"
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-8 italic relative z-10 text-lg leading-relaxed font-medium">
                  {testimonial.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-blue-600">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-slate-600 font-medium">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full shadow-lg font-semibold border border-emerald-200/50">
                    {testimonial.service}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
              Xem thêm đánh giá
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              Kiến thức hữu ích
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chia sẻ kinh nghiệm và mẹo hay về bảo trì thiết bị gia dụng
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} đọc</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <a
                    href="#"
                    className="inline-flex items-center text-indigo-600 font-medium group-hover:gap-2 transition-all">
                    Đọc thêm
                    <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
              Xem tất cả bài viết
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Technician Recruitment Section - Enhanced */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative order-2 lg:order-1" data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600"
                alt="Professional technician"
                className="rounded-2xl shadow-2xl w-full object-cover h-[350px] md:h-[400px] lg:h-auto"
                loading="lazy"
              />
              <div
                className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-6"
                data-aos="zoom-in"
                data-aos-delay="200">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">70%</p>
                  <p className="text-sm text-gray-600">Hoa hồng mỗi đơn</p>
                </div>
              </div>
              <div
                className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4"
                data-aos="zoom-in"
                data-aos-delay="300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">15-20tr</p>
                    <p className="text-xs text-gray-600">Thu nhập/tháng</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2" data-aos="fade-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                <span className="text-lg">🔥</span>
                Đang tuyển dụng kỹ thuật viên
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800">
                  Trở thành
                </span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 font-extrabold">
                  Kỹ thuật viên
                </span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800">
                  KCare
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Gia nhập đội ngũ kỹ thuật viên chuyên nghiệp của KCare. Nhận
                công việc linh hoạt, thu nhập hấp dẫn lên đến 20 triệu/tháng.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiDollarSign className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Hoa hồng cao - 70% mỗi đơn
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nhận ngay 70% giá trị đơn hàng, thanh toán hàng tuần
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Thời gian linh hoạt
                    </h4>
                    <p className="text-sm text-gray-600">
                      Tự do sắp xếp lịch làm việc phù hợp với bạn
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiShield className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Bảo hiểm & Hỗ trợ
                    </h4>
                    <p className="text-sm text-gray-600">
                      Được bảo hiểm tai nạn và hỗ trợ kỹ thuật 24/7
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiUsers className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Đào tạo chuyên nghiệp
                    </h4>
                    <p className="text-sm text-gray-600">
                      Được đào tạo kỹ năng và cập nhật kiến thức thường xuyên
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <Link
                  to="/register-technician"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Đăng ký ngay
                </Link>
                <a
                  href="#"
                  className="px-6 py-3 bg-white text-amber-600 font-semibold rounded-lg border-2 border-amber-500 hover:bg-amber-50 transition-all duration-200 shadow-sm">
                  Tìm hiểu thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div
          className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10"
          data-aos="zoom-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl mb-8 shadow-2xl border border-white/20">
            <FiHeadphones className="text-5xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 leading-tight">
            Cần hỗ trợ ngay?
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Chúng tôi luôn sẵn sàng!
            </span>
          </h2>
          <p className="text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed font-medium">
            Đội ngũ tư vấn viên và kỹ thuật viên K-Care phục vụ
            <span className="text-emerald-300 font-bold"> 24/7</span> với tất cả
            tâm huyết
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto mx-auto mb-12">
            <a
              href="tel:1900xxxx"
              className="group px-10 py-6 bg-white/95 backdrop-blur-sm text-indigo-700 font-bold rounded-2xl hover:bg-white transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 border border-white/50">
              <FiPhone className="text-2xl animate-pulse group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-lg">Gọi ngay</p>
                <p className="text-2xl font-black">1900 xxxx</p>
              </div>
            </a>
            <Link
              to="/booking"
              className="group px-10 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FiCalendar className="text-2xl relative z-10 group-hover:scale-110 transition-transform" />
              <span className="text-xl relative z-10">Đặt lịch online</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <BiSupport className="text-2xl text-emerald-300" />
              </div>
              <span className="text-lg font-semibold">Hỗ trợ 24/7</span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FaWarehouse className="text-2xl text-blue-300" />
              </div>
              <span className="text-lg font-semibold">
                Linh kiện chính hãng
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <FiPackage className="text-2xl text-purple-300" />
              </div>
              <span className="text-lg font-semibold">Bảo hành dài hạn</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
