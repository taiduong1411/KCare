import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiPhone,
  FiMapPin,
  FiClock,
  FiHome,
  FiTool,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMoreHorizontal,
  FiInfo,
  FiMail,
  FiEdit3,
  FiUserPlus,
  FiChevronDown,
} from "react-icons/fi";
import { FaTools, FaUserCircle } from "react-icons/fa";
import BookingModal from "../BookingModal/BookingModal";
import { Dropdown, Space, Avatar, Button } from "antd";
import { UserContext } from "../../contexts/UserContext";
import { getItems } from "../../services/custom.api";

// Add custom styles for mobile dropdown
const mobileDropdownStyle = `
  .mobile-dropdown .ant-dropdown-menu {
    min-width: 200px !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
    border-radius: 8px !important;
    border: 1px solid #e5e7eb !important;
  }
  .mobile-dropdown .ant-dropdown-menu-item {
    padding: 8px 12px !important;
  }
  .mobile-dropdown .ant-dropdown-menu-item:hover {
    background-color: #f3f4f6 !important;
  }
`;

// Inject styles
if (
  typeof document !== "undefined" &&
  !document.getElementById("mobile-dropdown-styles")
) {
  const style = document.createElement("style");
  style.id = "mobile-dropdown-styles";
  style.textContent = mobileDropdownStyle;
  document.head.appendChild(style);
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const location = useLocation();
  const { userData } = useContext(UserContext);
  const [services, setServices] = useState([]);
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest(".search-dropdown-container")) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    getServices();
  }, []);
  const getServices = async () => {
    const res = await getItems("admin/get-services");
    setServices(res.data.data);
  };

  // Main navigation items (reduced for cleaner look)
  const mainNavItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Dịch vụ", href: "/services" },
    { name: "Đặt lịch", href: "/booking", highlight: true },
  ];

  // Secondary items for dropdown menu
  const moreMenuItems = [
    {
      key: "about",
      label: (
        <Link to="/about" className="flex items-center gap-3 px-3 py-2">
          <FiInfo className="text-gray-600" />
          <span>Giới thiệu</span>
        </Link>
      ),
    },
    {
      key: "contact",
      label: (
        <Link to="/contact" className="flex items-center gap-3 px-3 py-2">
          <FiMail className="text-gray-600" />
          <span>Liên hệ</span>
        </Link>
      ),
    },
    {
      key: "blog",
      label: (
        <Link to="/blog" className="flex items-center gap-3 px-3 py-2">
          <FiEdit3 className="text-gray-600" />
          <span>Tin tức</span>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "register-technician",
      label: (
        <Link
          to="/register-technician"
          className="flex items-center gap-3 px-3 py-2">
          <FiUserPlus className="text-blue-600" />
          <span className="text-blue-600 font-medium">
            Đăng ký kỹ thuật viên
          </span>
        </Link>
      ),
    },
  ];

  // All items for mobile menu (keep original structure)
  const allNavItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Dịch vụ", href: "/services" },
    { name: "Đặt lịch", href: "/booking", highlight: true },
    { name: "Giới thiệu", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
    { name: "Tin tức", href: "/blog" },
    { name: "Đăng ký kỹ thuật viên", href: "/register-technician" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const userMenuItems = [
    {
      key: "1",
      label: (
        <Link
          to={
            userData?.role === "admin"
              ? "/admin/profile"
              : userData?.role === "technician"
              ? "/technician/profile"
              : "/profile"
          }
          className="flex items-center gap-2 px-4 py-2">
          <FiUser className="text-gray-600" />
          <span>Thông tin cá nhân</span>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          to={
            userData?.role === "admin"
              ? "/admin/settings"
              : userData?.role === "technician"
              ? "/technician/settings"
              : "/settings"
          }
          className="flex items-center gap-2 px-4 py-2">
          <FiSettings className="text-gray-600" />
          <span>Cài đặt</span>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-600 hover:text-red-700">
          <FiLogOut />
          <span>Đăng xuất</span>
        </button>
      ),
    },
  ];

  return (
    <>
      {/* Top Bar - Simplified & Professional */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-slate-900 text-slate-300 py-3 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-8">
              <div className="flex items-center gap-2">
                <FiPhone className="w-3 h-3" />
                <span>1900 xxxx</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="w-3 h-3" />
                <span>TP.HCM</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-3 h-3" />
                <span>8:00 - 20:00</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="hover:text-white transition-colors duration-200">
                Tin tức
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200">
                Khuyến mãi
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200">
                Hỗ trợ 24/7
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Modern & Clean */}
      <header
        className={`fixed top-0 lg:top-[42px] left-0 right-0 z-30 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100"
            : "bg-white/90 backdrop-blur-lg shadow-lg"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Enhanced & Modern */}
            <Link
              to="/"
              className="flex-shrink-0 flex items-center group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    <FiHome className="text-white text-2xl" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                    <FiTool className="text-white text-sm" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">
                    <span className="text-slate-800">K</span>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Care
                    </span>
                  </h1>
                  <p className="text-sm text-slate-500 -mt-1 font-medium">
                    Chăm sóc thiết bị chuyên nghiệp
                  </p>
                </div>
              </div>
            </Link>

            {/* Navigation Menu - Modern & Clean */}
            <nav className="hidden lg:flex items-center space-x-2">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      relative px-5 py-3 text-base font-semibold rounded-full transition-all duration-300 group whitespace-nowrap
                      ${
                        isActive
                          ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25"
                          : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/80"
                      }
                      ${
                        item.highlight && !isActive
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                          : ""
                      }
                    `}>
                    {item.name}
                    {item.highlight && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-sm"></span>
                    )}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    )}
                  </Link>
                );
              })}

              {/* More Menu Dropdown */}
              <Dropdown
                menu={{ items: moreMenuItems }}
                trigger={["hover"]}
                placement="bottomCenter">
                <button className="relative px-5 py-3 text-base font-semibold rounded-full transition-all duration-300 group whitespace-nowrap text-slate-700 hover:text-blue-600 hover:bg-blue-50/80">
                  <div className="flex items-center gap-2">
                    <span>Về Chúng Tôi</span>
                    <FiChevronDown className="w-4 h-4" />
                  </div>
                </button>
              </Dropdown>
            </nav>

            {/* Right Section - Enhanced */}
            <div className="flex items-center space-x-3">
              {/* Search - Modern Design */}
              <div className="relative search-dropdown-container">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group">
                  <FiSearch className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                </button>

                {/* Search Dropdown */}
                <div
                  className={`absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-200 transform origin-top-right z-50 ${
                    isSearchOpen
                      ? "opacity-100 scale-100 visible"
                      : "opacity-0 scale-95 invisible"
                  }`}>
                  <div className="p-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ, thiết bị..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Tìm kiếm phổ biến
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {services?.map((service) => (
                          <span
                            key={service._id}
                            className="px-3 py-1 bg-gray-100 hover:bg-blue-50 text-xs rounded-full cursor-pointer transition-colors">
                            {service.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Actions - Premium Design */}
              <div className="hidden lg:flex items-center space-x-3">
                {userData ? (
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    trigger={["click"]}
                    placement="bottomRight">
                    <div className="cursor-pointer group">
                      <Avatar
                        size={44}
                        src={userData.avatar}
                        className="border-2 border-blue-200 group-hover:border-blue-400 transition-all duration-300 shadow-md group-hover:shadow-lg"
                      />
                    </div>
                  </Dropdown>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 group whitespace-nowrap">
                    <FaUserCircle className="text-lg group-hover:scale-110 transition-transform duration-200" />
                    <span>Đăng nhập</span>
                  </Link>
                )}
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="relative px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden whitespace-nowrap">
                  <span className="relative z-10">Đặt lịch ngay</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Mobile Menu Button - Enhanced */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group">
                {isMenuOpen ? (
                  <FiX className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <FiMenu className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? "visible" : "invisible"
        }`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
          onTouchStart={() => setIsMenuOpen(false)}></div>

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}>
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex-shrink-0 p-6 border-b border-gray-100">
              {/* Close button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                <FiX className="w-6 h-6" />
              </button>

              {/* Logo or Title */}
              <h3 className="text-lg font-semibold text-gray-800 mt-2">Menu</h3>
            </div>

            {/* Navigation Section */}
            <div className="flex-grow p-6 overflow-y-auto">
              <nav className="space-y-2">
                {allNavItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        block px-4 py-3 rounded-lg font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        }
                        ${item.highlight ? "relative" : ""}
                      `}
                      onClick={() => setIsMenuOpen(false)}>
                      {item.name}
                      {item.highlight && (
                        <span className="absolute top-3 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Actions Section - Fixed at bottom */}
            <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-gray-50">
              {/* Mobile Actions */}
              <div className="space-y-3">
                {userData ? (
                  <div className="relative">
                    <Dropdown
                      menu={{ items: userMenuItems }}
                      trigger={["click"]}
                      placement="bottomLeft"
                      overlayClassName="mobile-dropdown"
                      getPopupContainer={(trigger) => trigger.parentNode}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors bg-white border border-gray-200">
                        <Avatar
                          size={40}
                          src={userData.avatar}
                          className="border-2 border-blue-100"
                        />
                        <div className="flex-grow">
                          <span className="text-sm font-medium text-gray-700 block">
                            {userData.fullName}
                          </span>
                          <span className="text-xs text-gray-500">
                            Nhấn để xem menu
                          </span>
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                      onClick={() => setIsMenuOpen(false)}>
                      <FaUserCircle className="mr-2 text-lg" />
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}>
                      Đăng ký tài khoản
                    </Link>
                  </>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <p className="flex items-center">
                  <FiPhone className="mr-2" />
                  Hotline: 1900 xxxx
                </p>
                <p className="flex items-center">
                  <FiClock className="mr-2" />
                  8:00 - 20:00 (T2 - CN)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}

export default Header;
