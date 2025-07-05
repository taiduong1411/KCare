import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Timeline from "../../../components/Timeline/Timeline";

import { getItems } from "../../../services/custom.api";
import { useNotification } from "../../../contexts/NotificationContext";
import {
  FiArrowLeft,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";

function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { showNotification } = useNotification();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetail();
    }
  }, [bookingId]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await getItems(`/booking/${bookingId}`);

      if (response.status === 200) {
        setBooking(response.data.data);
      } else {
        showNotification("error", "Không thể tải thông tin đơn hàng");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      showNotification("error", "Lỗi khi tải thông tin đơn hàng");
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-blue-100 text-blue-800 border-blue-200",
      accepted: "bg-yellow-100 text-yellow-800 border-yellow-200",
      in_progress: "bg-purple-100 text-purple-800 border-purple-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      warranty_requested: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Chờ xác nhận",
      accepted: "Đã xác nhận",
      in_progress: "Đang thực hiện",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
      warranty_requested: "Yêu cầu bảo hành",
    };
    return statusTexts[status] || "Không xác định";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-lg font-semibold text-gray-700">
                  Đang tải thông tin...
                </span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Không tìm thấy đơn hàng
              </h2>
              <p className="text-gray-600 mb-6">
                Đơn hàng bạn tìm kiếm không tồn tại hoặc bạn không có quyền truy
                cập.
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Quay lại danh sách đơn hàng
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4">
              <FiArrowLeft className="w-4 h-4" />
              Quay lại danh sách đơn hàng
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Chi tiết đơn hàng #{booking.orderCode}
                </h1>
                <p className="text-gray-600 mt-1">
                  Được tạo vào {formatDate(booking.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`
                  px-4 py-2 rounded-full text-sm font-semibold border
                  ${getStatusColor(booking.status)}
                `}>
                  {getStatusText(booking.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Thông tin dịch vụ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Dịch vụ
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.service?.name}
                    </p>
                    {booking.service?.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.service.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Thời gian dự kiến
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.service?.duration} phút
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Thời gian thực hiện
                    </label>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-blue-600" />
                      {formatDate(booking.scheduledTime)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Địa chỉ
                    </label>
                    <p className="text-lg font-semibold text-gray-900 flex items-start gap-2">
                      <FiMapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      {booking.address}
                    </p>
                  </div>
                </div>

                {booking.description && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FiFileText className="w-4 h-4" />
                      Ghi chú từ khách hàng
                    </label>
                    <p className="text-gray-900 mt-1 italic">
                      "{booking.description}"
                    </p>
                  </div>
                )}
              </div>

              {/* Technician Information */}
              {booking.technician && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Thông tin kỹ thuật viên
                  </h2>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      {booking.technician.account?.avatar ? (
                        <img
                          src={booking.technician.account.avatar}
                          alt={booking.technician.account?.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.technician.account?.fullName}
                      </h3>

                      <div className="mt-2 space-y-2">
                        {booking.technician.account?.phone && (
                          <p className="text-gray-600 flex items-center gap-2">
                            <FiPhone className="w-4 h-4 text-green-600" />
                            <a
                              href={`tel:${booking.technician.account.phone}`}
                              className="hover:text-blue-600 transition-colors">
                              {booking.technician.account.phone}
                            </a>
                          </p>
                        )}

                        {booking.technician.account?.email && (
                          <p className="text-gray-600 flex items-center gap-2">
                            <FiMail className="w-4 h-4 text-blue-600" />
                            <a
                              href={`mailto:${booking.technician.account.email}`}
                              className="hover:text-blue-600 transition-colors">
                              {booking.technician.account.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <Timeline order={booking} compact={false} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiDollarSign className="w-5 h-5 text-green-600" />
                  Thông tin thanh toán
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giá dịch vụ:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {booking.price?.amount
                        ? formatPrice(booking.price.amount)
                        : "0"}{" "}
                      đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      Trạng thái thanh toán:
                    </span>
                    <span
                      className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${
                        booking.payment?.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    `}>
                      {booking.payment?.status === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </span>
                  </div>

                  {booking.payment?.method && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Phương thức:</span>
                      <span className="text-gray-700">
                        {booking.payment.method === "cash" && "Tiền mặt"}
                        {booking.payment.method === "bank_transfer" &&
                          "Chuyển khoản"}
                        {booking.payment.method === "e_wallet" && "Ví điện tử"}
                      </span>
                    </div>
                  )}

                  {booking.payment?.paidAt && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        Thời gian thanh toán:
                      </span>
                      <span className="text-gray-700">
                        {new Date(booking.payment.paidAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Warranty Information */}
              {booking.warranty && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Thông tin bảo hành
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span
                        className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${
                          booking.warranty.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      `}>
                        {booking.warranty.status === "completed"
                          ? "Hoàn thành"
                          : "Đang xử lý"}
                      </span>
                    </div>

                    {booking.warranty.description && (
                      <div>
                        <span className="text-gray-500 text-sm">Mô tả:</span>
                        <p className="text-gray-700 text-sm mt-1">
                          {booking.warranty.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Thông tin khách hàng
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Họ tên
                    </label>
                    <p className="text-gray-900">
                      {booking.customer?.fullName}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </label>
                    <p className="text-gray-900">{booking.customer?.phone}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900">{booking.customer?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookingDetail;
