import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4">
        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-gray-600 text-lg">
            Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <img
            src="/images/404-illustration.svg"
            alt="404 Illustration"
            className="max-w-md mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Về trang chủ
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Liên hệ hỗ trợ
          </Link>
        </div>

        {/* Additional Info */}
        <p className="mt-8 text-gray-500">
          Nếu bạn tin rằng đây là lỗi, vui lòng{" "}
          <Link
            to="/contact"
            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
            liên hệ với chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
