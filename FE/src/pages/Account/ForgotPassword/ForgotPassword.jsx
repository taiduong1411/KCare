import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiHome,
  FiTool,
} from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

import { addItems } from "../../../services/custom.api";
import { useNotification } from "../../../contexts/NotificationContext";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const onSubmit = async (data) => {
    await addItems("/account/verify-email", data).then((res) => {
      if (res.status == 200) {
        setIsLoading(true);
        localStorage.setItem("reset-email", data["email"]);
        window.location.href = "/reset-password";
      } else {
        showNotification("error", res.data.msg);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FiHome className="text-white text-3xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <FiTool className="text-white text-sm" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold">
                <span className="text-gray-800">K</span>
                <span className="text-blue-600">Care</span>
              </h1>
              <p className="text-sm text-gray-500">
                Chăm sóc thiết bị tại nhà {alert}
              </p>
            </div>
          </Link>
        </div>

        {/* Forgot Password Box */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h2>
            <p className="mt-2 text-sm text-gray-600">
              Nhập email để lấy lại mật khẩu
            </p>
          </div>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
                {...register("email")}>
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="example@email.com"
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Lấy lại mật khẩu"}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Quay lại trang đăng nhập?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Link to="/terms" className="text-gray-500 hover:text-gray-700">
              Điều khoản sử dụng
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700">
              Chính sách bảo mật
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/help" className="text-gray-500 hover:text-gray-700">
              Trợ giúp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
