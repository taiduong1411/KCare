import React from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiChevronRight,
  FiShield,
  FiAward,
  FiHeadphones,
  FiHome,
  FiTool,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaTools,
  FaSnowflake,
  FaTv,
} from "react-icons/fa";
import { BiLogoVisa, BiLogoMastercard } from "react-icons/bi";
import { SiZalo } from "react-icons/si";
import { MdKitchen, MdLocalLaundryService } from "react-icons/md";

function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    "Bảo trì máy lạnh định kỳ",
    "Vệ sinh tủ lạnh",
    "Sửa chữa máy giặt",
    "Bảo dưỡng TV",
    "Vệ sinh máy nước nóng",
    "Bảo trì lò vi sóng",
    "Sửa chữa quạt điện",
    "Vệ sinh máy lọc nước",
  ];

  const policies = [
    "Chính sách bảo hành",
    "Quy trình làm việc",
    "Chính sách giá",
    "Điều khoản sử dụng",
    "Cam kết dịch vụ",
  ];

  const quickLinks = [
    "Về chúng tôi",
    "Bảng giá dịch vụ",
    "Khuyến mãi",
    "Tuyển dụng kỹ thuật viên",
    "Đăng ký làm kỹ thuật viên",
    "Liên hệ",
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
          {/* Newsletter Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 mb-4">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                  Ưu đãi đặc biệt
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Đăng ký nhận ưu đãi bảo trì định kỳ
                </h3>
                <p className="text-xl text-blue-100 max-w-2xl">
                  Giảm ngay{" "}
                  <span className="font-bold text-yellow-300">15%</span> cho gói
                  bảo trì thiết bị gia đình trọn năm
                </p>
              </div>
              <div className="w-full lg:w-auto lg:min-w-[400px]">
                <form className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn..."
                      className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                  </div>
                  <button
                    type="submit"
                    className="group relative bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <span>Đăng ký ngay</span>
                    <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                    <FiHome className="text-white text-2xl" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FiTool className="text-white text-sm" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-transparent blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      K
                    </span>
                    <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      Care
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    Chăm sóc thiết bị tại nhà bạn
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg">
              Dịch vụ bảo trì, vệ sinh và sửa chữa thiết bị điện gia đình tại
              nhà chuyên nghiệp. Đội ngũ kỹ thuật viên giàu kinh nghiệm, tận tâm
              phục vụ 24/7.
            </p>

            {/* Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300 group hover:text-white transition-colors duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiShield className="text-white" />
                </div>
                <span className="font-medium">Bảo hành chất lượng dịch vụ</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 group hover:text-white transition-colors duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiAward className="text-white" />
                </div>
                <span className="font-medium">Kỹ thuật viên chứng chỉ</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 group hover:text-white transition-colors duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiHome className="text-white" />
                </div>
                <span className="font-medium">Phục vụ tận nhà 24/7</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">
                Kết nối với chúng tôi
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="group relative w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/25">
                  <FaFacebookF className="group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a
                  href="#"
                  className="group relative w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 text-white rounded-xl flex items-center justify-center hover:from-purple-500 hover:via-pink-500 hover:to-red-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-pink-500/25">
                  <FaInstagram className="group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a
                  href="#"
                  className="group relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl flex items-center justify-center hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-red-500/25">
                  <FaYoutube className="group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a
                  href="#"
                  className="group relative w-12 h-12 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl flex items-center justify-center hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-gray-500/25">
                  <FaTiktok className="group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a
                  href="#"
                  className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/25">
                  <SiZalo className="text-lg group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></span>
              Dịch vụ của chúng tôi
            </h3>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-3 group py-2">
                    <FiChevronRight className="text-blue-400 group-hover:translate-x-2 group-hover:text-blue-300 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {service}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-bold gap-2 group bg-blue-500/10 hover:bg-blue-500/20 px-6 py-3 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-400/30">
              Xem tất cả dịch vụ
              <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          {/* Quick Links & Policies */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></span>
              Liên kết nhanh
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={
                      link === "Đăng ký làm kỹ thuật viên"
                        ? "/register-technician"
                        : "#"
                    }
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-3 group py-2">
                    <FiChevronRight className="text-purple-400 group-hover:translate-x-2 group-hover:text-purple-300 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <h4 className="text-lg font-bold text-white mb-6">
                Thiết bị phục vụ
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="group relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 hover:from-blue-500/20 hover:to-blue-600/20 hover:border-blue-400/30 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  title="Máy lạnh">
                  <FaSnowflake className="text-blue-400 text-2xl mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm text-gray-300 font-medium">Máy lạnh</p>
                </div>
                <div
                  className="group relative bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 hover:from-green-500/20 hover:to-green-600/20 hover:border-green-400/30 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  title="Tủ lạnh">
                  <MdKitchen className="text-green-400 text-2xl mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm text-gray-300 font-medium">Tủ lạnh</p>
                </div>
                <div
                  className="group relative bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-400/30 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  title="Máy giặt">
                  <MdLocalLaundryService className="text-purple-400 text-2xl mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm text-gray-300 font-medium">Máy giặt</p>
                </div>
                <div
                  className="group relative bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-4 hover:from-orange-500/20 hover:to-orange-600/20 hover:border-orange-400/30 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  title="TV">
                  <FaTv className="text-orange-400 text-2xl mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm text-gray-300 font-medium">TV</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></span>
              Thông tin liên hệ
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiMapPin className="text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Khu vực phục vụ:</p>
                  <p className="text-gray-300">TP.HCM và các tỉnh lân cận</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiPhone className="text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Hotline đặt lịch:</p>
                  <a
                    href="tel:1900xxxx"
                    className="text-green-400 font-bold text-2xl hover:text-green-300 transition-colors duration-300">
                    1900 xxxx
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiMail className="text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Email:</p>
                  <a
                    href="mailto:support@kcare.vn"
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                    support@kcare.vn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiClock className="text-orange-400" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">
                    Thời gian phục vụ:
                  </p>
                  <p className="text-gray-300">24/7 (Kể cả ngày lễ, Tết)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiHeadphones className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Hỗ trợ khẩn cấp:</p>
                  <p className="text-gray-300">Phản hồi trong 30 phút</p>
                </div>
              </div>
            </div>

            {/* Emergency Box */}
            <div className="relative bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 group hover:from-red-500/30 hover:to-red-600/30 hover:border-red-400/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl"></div>
              <div className="relative">
                <p className="text-lg font-bold text-red-300 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
                  Sự cố khẩn cấp?
                </p>
                <p className="text-red-200">
                  Gọi ngay:{" "}
                  <span className="font-bold text-xl text-red-300">
                    0909 xxx xxx
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Policies & Payment */}
        <div className="mt-20 pt-12 border-t border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-bold text-white mb-6">
                Chính sách & Cam kết
              </h4>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {policies.map((policy, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium">
                    {policy}
                  </a>
                ))}
              </div>
            </div>

            <div className="md:text-right">
              <h4 className="text-xl font-bold text-white mb-6">
                Phương thức thanh toán
              </h4>
              <div className="flex items-center gap-6 md:justify-end">
                <span className="text-gray-300 font-medium">Tiền mặt</span>
                <div className="flex items-center gap-4">
                  <BiLogoVisa className="text-5xl text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer" />
                  <BiLogoMastercard className="text-5xl text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer" />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                    alt="MoMo"
                    className="h-10 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  />
                  <img
                    src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg"
                    alt="VNPay"
                    className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-t border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-300 font-medium">
              © {currentYear} KCare. Tất cả quyền được bảo lưu.
            </p>
            <p className="text-gray-400">
              Dịch vụ chăm sóc thiết bị điện gia đình tại nhà uy tín nhất
            </p>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-2xl hover:from-blue-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center group hover:shadow-blue-500/25 transform hover:scale-110 hover:-translate-y-1 z-50">
        <svg
          className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </footer>
  );
}

export default Footer;
