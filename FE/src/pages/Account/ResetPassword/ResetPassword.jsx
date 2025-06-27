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
import { addItems } from "../../../services/custom.api";
import { useNotification } from "../../../contexts/NotificationContext";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      showNotification("error", "Mật khẩu không khớp");
      return;
    }
    const allData = {
      ...data,
      email: localStorage.getItem("reset-email"),
    };
    await addItems("/account/reset-password", allData).then((res) => {
      if (res.status == 200) {
        setIsLoading(true);
        showNotification("success", res.data.msg);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
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
            <h2 className="text-2xl font-bold text-gray-900">
              Nhập mã OTP đã được gửi đến email của bạn để đặt lại mật khẩu
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Nhập mã OTP đã được gửi đến email của bạn để đặt lại mật khẩu
            </p>
          </div>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-1"
                {...register("code")}>
                Mã OTP
              </label>
              <div className="relative">
                <input
                  id="code"
                  type="text"
                  autoComplete="text"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.code
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Nhập mã OTP"
                  {...register("code", {
                    required: "Mã OTP là bắt buộc",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Mã OTP không hợp lệ",
                    },
                  })}
                />
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
                {...register("password")}>
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Nhập mật khẩu"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
                    },
                  })}
                />
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
                {...register("confirmPassword")}>
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Nhập lại mật khẩu"
                  {...register("confirmPassword", {
                    required: "Nhập lại mật khẩu là bắt buộc",
                    validate: (value) => {
                      const { password } = getValues();
                      return value === password || "Mật khẩu không khớp";
                    },
                  })}
                />
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Quay lại trang đăng nhập?{" "}
              <Link
                to="/login"
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

export default ResetPassword;
