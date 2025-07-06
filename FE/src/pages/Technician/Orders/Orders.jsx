import React, { useState, useEffect } from "react";
import { getItems, updateItem } from "../../../services/custom.api";
import SideBarTechnician from "../../../components/SideBarTechnician/SideBarTechnician";
import {
  FiClock,
  FiCheckCircle,
  FiPlay,
  FiX,
  FiEye,
  FiAlertCircle,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiSettings,
  FiTool,
  FiCheck,
} from "react-icons/fi";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // confirm, start, complete, reject
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [modalData, setModalData] = useState({
    notes: "",
    estimatedDuration: "",
    finalPrice: "",
    partsUsed: "",
    workDescription: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url =
        selectedStatus === "all"
          ? "/booking/technician/orders"
          : `/booking/technician/orders?status=${selectedStatus}`;

      const response = await getItems(url);

      if (response.status === 200) {
        setOrders(response.data.data);
      } else {
        console.error("Error fetching orders:", response.error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, orderId) => {
    setActionLoading(true);
    try {
      let endpoint = "";
      let payload = {};

      switch (action) {
        case "confirm":
          endpoint = `/booking/${orderId}/confirm`;
          payload = { notes: modalData.notes };
          break;
        case "start":
          endpoint = `/booking/${orderId}/start`;
          payload = {
            notes: modalData.notes,
            estimatedDuration: modalData.estimatedDuration,
          };
          break;
        case "complete":
          endpoint = `/booking/${orderId}/complete`;
          payload = {
            notes: modalData.notes,
            finalPrice: modalData.finalPrice
              ? parseFloat(modalData.finalPrice)
              : null,
            partsUsed: modalData.partsUsed,
            workDescription: modalData.workDescription,
          };
          break;
        case "reject":
          endpoint = `/booking/${orderId}/reject`;
          payload = { reason: modalData.notes };
          break;
        case "complete_warranty":
          endpoint = `/booking/${orderId}/complete_warranty`;
          payload = {
            notes: modalData.notes,
            workDescription: modalData.workDescription,
            partsUsed: modalData.partsUsed,
          };
          break;
        default:
          return;
      }

      const response = await updateItem(endpoint, payload);

      if (response.status === 200 && response.data.success) {
        showConfirm("Cập nhật đơn hàng thành công!", () => {
          setShowModal(false);
          setModalData({
            notes: "",
            estimatedDuration: "",
            finalPrice: "",
            partsUsed: "",
            workDescription: "",
          });
          fetchOrders(); // Refresh orders
        });
      } else {
        showConfirm(
          `Lỗi: ${response.error || `Lỗi khi ${action} đơn hàng`}`,
          () => {}
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      showConfirm(
        `Lỗi: ${error.response?.data?.message || `Lỗi khi ${action} đơn hàng`}`,
        () => {}
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (type, order) => {
    setModalType(type);
    setSelectedOrder(order);
    setShowModal(true);
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const showConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setModalType("");
    setModalData({
      notes: "",
      estimatedDuration: "",
      finalPrice: "",
      partsUsed: "",
      workDescription: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "pending_confirmation":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "pending_customer_confirmation":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending_admin_review":
        return "bg-orange-100 text-orange-800";
      case "warranty_requested":
        return "bg-purple-100 text-purple-800";
      case "warranty_completed":
        return "bg-cyan-100 text-cyan-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "pending_confirmation":
        return "Chờ xác nhận (2 phút)";
      case "accepted":
        return "Đã xác nhận";
      case "in_progress":
        return "Đang sửa chữa";
      case "pending_customer_confirmation":
        return "Chờ khách hàng xác nhận";
      case "completed":
        return "Hoàn thành";
      case "pending_admin_review":
        return "Chờ admin duyệt";
      case "warranty_requested":
        return "Yêu cầu bảo hành";
      case "warranty_completed":
        return "Chờ khách hàng xác nhận bảo hành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="w-4 h-4" />;
      case "pending_confirmation":
        return <FiAlertCircle className="w-4 h-4" />;
      case "accepted":
        return <FiCheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <FiPlay className="w-4 h-4" />;
      case "pending_customer_confirmation":
        return <FiMessageSquare className="w-4 h-4" />;
      case "completed":
        return <FiCheck className="w-4 h-4" />;
      case "pending_admin_review":
        return <FiAlertCircle className="w-4 h-4" />;
      case "warranty_requested":
        return <FiTool className="w-4 h-4" />;
      case "warranty_completed":
        return <FiMessageSquare className="w-4 h-4" />;
      case "cancelled":
        return <FiX className="w-4 h-4" />;
      default:
        return <FiAlertCircle className="w-4 h-4" />;
    }
  };

  const getActionButton = (order) => {
    switch (order.status) {
      case "pending":
        return null; // Không có action cho pending
      case "pending_confirmation":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => openModal("confirm", order)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
              <FiCheckCircle className="w-4 h-4 inline mr-1" />
              Xác nhận
            </button>
            <button
              onClick={() => openModal("reject", order)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
              <FiX className="w-4 h-4 inline mr-1" />
              Từ chối
            </button>
          </div>
        );
      case "accepted":
        return (
          <button
            onClick={() => openModal("start", order)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
            <FiTool className="w-4 h-4 inline mr-1" />
            Bắt đầu
          </button>
        );
      case "in_progress":
        return (
          <button
            onClick={() => openModal("complete", order)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
            <FiCheck className="w-4 h-4 inline mr-1" />
            Hoàn thành
          </button>
        );
      case "pending_customer_confirmation":
        return (
          <span className="text-sm text-gray-500 italic">
            Chờ khách hàng xác nhận
          </span>
        );
      case "pending_admin_review":
        return (
          <span className="text-sm text-orange-500 italic">
            Chờ admin duyệt khiếu nại
          </span>
        );
      case "warranty_requested":
        return (
          <button
            onClick={() => openModal("complete_warranty", order)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
            <FiCheck className="w-4 h-4 inline mr-1" />
            Hoàn thành bảo hành
          </button>
        );
      case "warranty_completed":
        return (
          <span className="text-sm text-cyan-500 italic">
            Chờ khách hàng xác nhận bảo hành
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBarTechnician />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="orders-container">
          <div className="orders-header">
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-600">
              Xem và xử lý các đơn hàng được phân công
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`filter-tab ${
                selectedStatus === "all" ? "active" : ""
              }`}>
              Tất cả ({orders.length})
            </button>
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`filter-tab ${
                selectedStatus === "pending" ? "active" : ""
              }`}>
              Chờ xử lý (
              {orders.filter((order) => order.status === "pending").length})
            </button>
            <button
              onClick={() => setSelectedStatus("pending_confirmation")}
              className={`filter-tab ${
                selectedStatus === "pending_confirmation" ? "active" : ""
              }`}>
              Chờ xác nhận (
              {
                orders.filter(
                  (order) => order.status === "pending_confirmation"
                ).length
              }
              )
            </button>
            <button
              onClick={() => setSelectedStatus("accepted")}
              className={`filter-tab ${
                selectedStatus === "accepted" ? "active" : ""
              }`}>
              Đã xác nhận (
              {orders.filter((order) => order.status === "accepted").length})
            </button>
            <button
              onClick={() => setSelectedStatus("in_progress")}
              className={`filter-tab ${
                selectedStatus === "in_progress" ? "active" : ""
              }`}>
              Đang sửa (
              {orders.filter((order) => order.status === "in_progress").length})
            </button>
            <button
              onClick={() => setSelectedStatus("pending_customer_confirmation")}
              className={`filter-tab ${
                selectedStatus === "pending_customer_confirmation"
                  ? "active"
                  : ""
              }`}>
              Chờ KH xác nhận (
              {
                orders.filter(
                  (order) => order.status === "pending_customer_confirmation"
                ).length
              }
              )
            </button>
            <button
              onClick={() => setSelectedStatus("completed")}
              className={`filter-tab ${
                selectedStatus === "completed" ? "active" : ""
              }`}>
              Hoàn thành (
              {orders.filter((order) => order.status === "completed").length})
            </button>
          </div>

          {/* Orders List */}
          <div className="orders-grid">
            {orders.length === 0 ? (
              <div className="no-orders">
                <FiAlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">
                  Không có đơn hàng
                </h3>
                <p className="text-gray-500">
                  Chưa có đơn hàng nào trong danh mục này
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-code">
                      <span className="text-sm font-medium text-gray-600">
                        Mã đơn:
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {order.orderCode}
                      </span>
                    </div>
                    <div
                      className={`status-badge ${getStatusColor(
                        order.status
                      )}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-content">
                    <div className="order-info">
                      <div className="info-row">
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span>{order.customer.fullName}</span>
                      </div>
                      <div className="info-row">
                        <FiSettings className="w-4 h-4 text-gray-500" />
                        <span>{order.service.name}</span>
                      </div>
                      <div className="info-row">
                        <FiMapPin className="w-4 h-4 text-gray-500" />
                        <span>{order.address}</span>
                      </div>
                      <div className="info-row">
                        <FiCalendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(order.scheduledTime)}</span>
                      </div>
                      <div className="info-row">
                        <FiDollarSign className="w-4 h-4 text-gray-500" />
                        <span>{formatPrice(order.price.amount)}</span>
                      </div>
                    </div>

                    <div className="order-actions">
                      {getActionButton(order)}
                      <button
                        onClick={() => openDetailModal(order)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                        <FiEye className="w-4 h-4 inline mr-1" />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="text-xl font-bold">
                    {modalType === "confirm" && "Xác nhận đơn hàng"}
                    {modalType === "start" && "Bắt đầu sửa chữa"}
                    {modalType === "complete" && "Hoàn thành sửa chữa"}
                    {modalType === "complete_warranty" && "Hoàn thành bảo hành"}
                    {modalType === "reject" && "Từ chối đơn hàng"}
                  </h2>
                  <button onClick={closeModal} className="close-button">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-container">
                    {modalType === "confirm" && (
                      <p className="mb-4 text-gray-600">
                        Bạn có chắc chắn muốn xác nhận đơn hàng này?
                      </p>
                    )}

                    {modalType === "reject" && (
                      <div>
                        <p className="mb-4 text-gray-600">
                          Vui lòng cho biết lý do từ chối đơn hàng:
                        </p>
                        <div className="form-group">
                          <label htmlFor="rejectReason">Lý do từ chối:</label>
                          <textarea
                            id="rejectReason"
                            value={modalData.notes}
                            onChange={(e) =>
                              setModalData({
                                ...modalData,
                                notes: e.target.value,
                              })
                            }
                            placeholder="Nhập lý do từ chối..."
                            className="form-textarea"
                            rows="3"
                            required
                          />
                        </div>
                        <p className="text-sm text-red-600 mt-2">
                          * Đơn hàng sẽ được phân công cho kỹ thuật viên khác
                        </p>
                      </div>
                    )}

                    {modalType === "start" && (
                      <div className="form-group">
                        <label htmlFor="estimatedDuration">
                          Thời gian dự kiến (phút):
                        </label>
                        <input
                          type="number"
                          id="estimatedDuration"
                          value={modalData.estimatedDuration}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              estimatedDuration: e.target.value,
                            })
                          }
                          placeholder="VD: 60"
                          className="form-input"
                        />
                      </div>
                    )}

                    {modalType === "complete" && (
                      <>
                        <div className="form-group">
                          <label htmlFor="workDescription">
                            Mô tả công việc đã thực hiện:
                          </label>
                          <textarea
                            id="workDescription"
                            value={modalData.workDescription}
                            onChange={(e) =>
                              setModalData({
                                ...modalData,
                                workDescription: e.target.value,
                              })
                            }
                            placeholder="Mô tả công việc đã hoàn thành..."
                            className="form-textarea"
                            rows="3"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="partsUsed">
                            Linh kiện đã sử dụng:
                          </label>
                          <textarea
                            id="partsUsed"
                            value={modalData.partsUsed}
                            onChange={(e) =>
                              setModalData({
                                ...modalData,
                                partsUsed: e.target.value,
                              })
                            }
                            placeholder="Danh sách linh kiện đã thay thế..."
                            className="form-textarea"
                            rows="2"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="finalPrice">
                            Tổng chi phí (VNĐ):
                          </label>
                          <input
                            type="number"
                            id="finalPrice"
                            value={modalData.finalPrice}
                            onChange={(e) =>
                              setModalData({
                                ...modalData,
                                finalPrice: e.target.value,
                              })
                            }
                            placeholder="Để trống nếu không thay đổi"
                            className="form-input"
                          />
                        </div>
                      </>
                    )}

                    {modalType === "complete_warranty" && (
                      <>
                        <div className="form-group">
                          <label htmlFor="workDescription">
                            Mô tả công việc bảo hành đã thực hiện:
                          </label>
                          <textarea
                            id="workDescription"
                            value={modalData.workDescription}
                            onChange={(e) =>
                              setModalData({
                                ...modalData,
                                workDescription: e.target.value,
                              })
                            }
                            placeholder="Mô tả công việc bảo hành đã hoàn thành..."
                            className="form-textarea"
                            rows="3"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="partsUsed">
                            Linh kiện đã sử dụng:
                          </label>
                          <textarea
                            id="partsUsed"
                            value={modalData.partsUsed}
                            onChange={(e) =>
                              setModalData({
                                ...modalData,
                                partsUsed: e.target.value,
                              })
                            }
                            placeholder="Danh sách linh kiện đã thay thế trong bảo hành..."
                            className="form-textarea"
                            rows="2"
                          />
                        </div>
                      </>
                    )}

                    {modalType !== "reject" && (
                      <div className="form-group">
                        <label htmlFor="notes">Ghi chú:</label>
                        <textarea
                          id="notes"
                          value={modalData.notes}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Ghi chú thêm..."
                          className="form-textarea"
                          rows="2"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    onClick={closeModal}
                    className="btn-secondary"
                    disabled={actionLoading}>
                    Hủy
                  </button>
                  <button
                    onClick={() => handleAction(modalType, selectedOrder._id)}
                    className="btn-primary"
                    disabled={actionLoading}>
                    {actionLoading
                      ? "Đang xử lý..."
                      : modalType === "confirm"
                      ? "Xác nhận"
                      : modalType === "reject"
                      ? "Từ chối"
                      : modalType === "start"
                      ? "Bắt đầu"
                      : modalType === "complete"
                      ? "Hoàn thành"
                      : modalType === "complete_warranty"
                      ? "Hoàn thành bảo hành"
                      : "Xác nhận"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Detail Modal */}
          {showDetailModal && selectedOrder && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="text-xl font-bold">Chi tiết đơn sửa chữa</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="close-button">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="order-details">
                    <div className="detail-row">
                      <span className="detail-label">Mã đơn:</span>
                      <span className="detail-value">
                        {selectedOrder.orderCode}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Khách hàng:</span>
                      <span className="detail-value">
                        {selectedOrder.customer.fullName}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Số điện thoại:</span>
                      <span className="detail-value">
                        {selectedOrder.customer.phone}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Địa chỉ:</span>
                      <span className="detail-value">
                        {selectedOrder.address}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Dịch vụ:</span>
                      <span className="detail-value">
                        {selectedOrder.service.name}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Kỹ thuật viên:</span>
                      <span className="detail-value">
                        {selectedOrder.technician?.account?.fullName ||
                          "Chưa phân công"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Vấn đề:</span>
                      <span className="detail-value">
                        {selectedOrder.description || "Không có mô tả"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Chi phí dự kiến:</span>
                      <span className="detail-value">
                        {formatPrice(selectedOrder.price.amount)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Trạng thái:</span>
                      <span
                        className={`status-badge ${getStatusColor(
                          selectedOrder.status
                        )}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">
                          {getStatusText(selectedOrder.status)}
                        </span>
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Ghi chú:</span>
                      <span className="detail-value">
                        {selectedOrder.description || "Không có ghi chú"}
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  {selectedOrder.timeline &&
                    selectedOrder.timeline.length > 0 && (
                      <div className="timeline-section">
                        <h3 className="text-lg font-semibold mb-3">
                          Lịch sử đơn hàng
                        </h3>
                        <div className="timeline">
                          {selectedOrder.timeline.map((item, index) => (
                            <div key={index} className="timeline-item">
                              <div className="timeline-dot">
                                {getStatusIcon(item.status)}
                              </div>
                              <div className="timeline-content">
                                <p className="timeline-description">
                                  {item.description}
                                </p>
                                <p className="timeline-date">
                                  {formatDate(item.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="modal-footer">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="btn-secondary">
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Modal */}
          {showConfirmModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="text-xl font-bold">Xác nhận</h2>
                </div>

                <div className="modal-body">
                  <p className="text-gray-700">{confirmMessage}</p>
                </div>

                <div className="modal-footer">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="btn-secondary">
                    Đóng
                  </button>
                  <button onClick={handleConfirm} className="btn-primary">
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
