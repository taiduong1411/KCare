import React, { useState, useEffect } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { getItems, putItems } from "../../../services/custom.api";
import SideBarAdmin from "../../../components/SideBarAdmin/Sidebar";

const Complaints = () => {
  const { showNotification } = useNotification();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDecision, setReviewDecision] = useState("");
  const [reviewReason, setReviewReason] = useState("");
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [stats, setStats] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchComplaintStats();
  }, [activeTab]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getItems(`/admin/complaints?status=${activeTab}`);
      if (response.status === 200) {
        setComplaints(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      showNotification("error", "Không thể tải danh sách khiếu nại");
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintStats = async () => {
    try {
      const response = await getItems("/admin/technicians/complaint-stats");
      if (response.status === 200) {
        setStats(response.data.data || {});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchAvailableTechnicians = async (
    serviceId,
    excludeTechnicianId,
    customerAddress
  ) => {
    try {
      setLoadingTechnicians(true);
      console.log("🔍 Fetching technicians with params:", {
        serviceId,
        excludeTechnicianId,
        customerAddress,
      });

      const response = await getItems(
        `/admin/technicians/available-for-warranty?serviceId=${serviceId}&excludeTechnicianId=${excludeTechnicianId}&customerAddress=${encodeURIComponent(
          customerAddress || ""
        )}`
      );

      if (response.status === 200) {
        setAvailableTechnicians(response.data.data || []);
        console.log(
          `✅ Found ${response.data.data?.length || 0} available technicians`
        );
      }
    } catch (error) {
      console.error("❌ Error fetching technicians:", error);
      showNotification("error", "Không thể tải danh sách kỹ thuật viên");
    } finally {
      setLoadingTechnicians(false);
    }
  };

  const fetchAvailableTimeSlots = async (technicianId, date) => {
    try {
      const response = await getItems(
        `/booking/available-slots?technicianId=${technicianId}&date=${date}`
      );
      if (response.status === 200) {
        setAvailableTimeSlots(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      showNotification("error", "Không thể tải khung giờ trống");
    }
  };

  const handleTechnicianChange = (technicianId) => {
    setSelectedTechnician(technicianId);
    setSelectedDate("");
    setSelectedTimeSlot("");
    setAvailableTimeSlots([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot("");
    if (selectedTechnician && date) {
      fetchAvailableTimeSlots(selectedTechnician, date);
    }
  };

  const handleReviewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowReviewModal(true);
    setReviewDecision("");
    setReviewReason("");
    setSelectedTechnician("");
    setSelectedDate("");
    setSelectedTimeSlot("");
    setAvailableTimeSlots([]);
  };

  const handleReviewDecisionChange = (decision) => {
    console.log("🔄 Review decision changed to:", decision);
    setReviewDecision(decision);

    // Reset technician selection when decision changes
    setSelectedTechnician("");
    setSelectedDate("");
    setSelectedTimeSlot("");
    setAvailableTimeSlots([]);

    // Fetch technicians if approving
    if (
      decision === "approved" &&
      selectedComplaint?.service &&
      selectedComplaint?.technician
    ) {
      console.log("✅ Conditions met, fetching technicians...");
      console.log("Selected complaint:", {
        serviceId: selectedComplaint.service._id,
        technicianId: selectedComplaint.technician._id,
        customerAddress: selectedComplaint.customer?.address,
      });

      fetchAvailableTechnicians(
        selectedComplaint.service._id,
        selectedComplaint.technician._id,
        selectedComplaint.customer?.address
      );
    } else {
      console.log("❌ Conditions not met for fetching technicians:", {
        decision,
        hasService: !!selectedComplaint?.service,
        hasTechnician: !!selectedComplaint?.technician,
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewDecision || !reviewReason) {
      showNotification("error", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (reviewDecision === "approved" && !selectedTechnician) {
      showNotification("error", "Vui lòng chọn kỹ thuật viên mới");
      return;
    }

    if (reviewDecision === "approved" && !selectedDate) {
      showNotification("error", "Vui lòng chọn ngày thực hiện");
      return;
    }

    if (reviewDecision === "approved" && !selectedTimeSlot) {
      showNotification("error", "Vui lòng chọn khung giờ");
      return;
    }

    try {
      setLoading(true);
      const response = await putItems(
        `/admin/complaints/${selectedComplaint._id}/review`,
        {
          decision: reviewDecision,
          reason: reviewReason,
          assignedTechnicianId: selectedTechnician || null,
          scheduledDate: selectedDate || null,
          scheduledTime: selectedTimeSlot || null,
        }
      );

      if (response.status === 200) {
        showNotification(
          "success",
          `Đã ${reviewDecision === "approved" ? "duyệt" : "từ chối"} khiếu nại`
        );
        setShowReviewModal(false);
        fetchComplaints();
        fetchComplaintStats();
        // Reset form
        setReviewDecision("");
        setReviewReason("");
        setSelectedTechnician("");
        setSelectedDate("");
        setSelectedTimeSlot("");
        setAvailableTimeSlots([]);
      } else {
        showNotification("error", response.data?.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error reviewing complaint:", error);
      showNotification("error", "Lỗi khi xử lý khiếu nại");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const getComplaintReasonColor = (reason) => {
    switch (reason) {
      case "Chất lượng dịch vụ không đạt":
        return "bg-red-100 text-red-800";
      case "Kỹ thuật viên không chuyên nghiệp":
        return "bg-orange-100 text-orange-800";
      case "Không giải quyết được vấn đề":
        return "bg-yellow-100 text-yellow-800";
      case "Thái độ phục vụ không tốt":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReviewStatus = (complaint) => {
    if (!complaint.adminReview?.reviewedAt) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Chờ xử lý
        </span>
      );
    }

    if (complaint.adminReview.decision === "approved") {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Đã duyệt
        </span>
      );
    } else {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Đã từ chối
        </span>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-shrink-0">
        <SideBarAdmin />
      </div>

      <div className="flex-1 min-w-0">
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý khiếu nại
              </h1>
              <p className="text-gray-600">
                Xem xét và xử lý khiếu nại từ khách hàng
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {activeTab === "all"
                        ? "Tổng khiếu nại"
                        : activeTab === "pending"
                        ? "Chờ xử lý"
                        : "Đã xử lý"}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {complaints.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      KTV hoạt động
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.stats?.activeTechnicians || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      KTV bị khóa
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.stats?.lockedTechnicians || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Tổng khiếu nại
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.stats?.totalComplaints || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`${
                      activeTab === "all"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                    Tất cả khiếu nại
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`${
                      activeTab === "pending"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                    Chờ xử lý
                  </button>
                  <button
                    onClick={() => setActiveTab("processed")}
                    className={`${
                      activeTab === "processed"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                    Đã xử lý
                  </button>
                </nav>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === "all"
                    ? "Tất cả khiếu nại"
                    : activeTab === "pending"
                    ? "Khiếu nại chờ xử lý"
                    : "Khiếu nại đã xử lý"}
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="p-8 text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-600">
                    {activeTab === "all"
                      ? "Không có khiếu nại nào"
                      : activeTab === "pending"
                      ? "Không có khiếu nại nào chờ xử lý"
                      : "Không có khiếu nại nào đã xử lý"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã đơn hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kỹ thuật viên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dịch vụ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lý do khiếu nại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá trị
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái xử lý
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {complaints.map((complaint) => (
                        <tr key={complaint._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{complaint.orderCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {complaint.customer?.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {complaint.customer?.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {complaint.technician?.account?.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {complaint.technician?.account?.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {complaint.service?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getComplaintReasonColor(
                                complaint.customerConfirmation?.complaintReason
                              )}`}>
                              {complaint.customerConfirmation?.complaintReason}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(
                              complaint.customerConfirmation?.confirmedAt
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(complaint.price?.amount || 0)} đ
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getReviewStatus(complaint)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!complaint.adminReview?.reviewedAt ? (
                              <button
                                onClick={() => handleReviewComplaint(complaint)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors">
                                Xem xét
                              </button>
                            ) : (
                              <div className="space-y-1">
                                <div className="text-xs text-gray-500">
                                  Đã xử lý bởi Admin
                                </div>
                                <div className="text-xs text-gray-400">
                                  {formatDate(complaint.adminReview.reviewedAt)}
                                </div>
                                {complaint.adminReview.reason && (
                                  <div
                                    className="text-xs text-gray-600 max-w-32 truncate"
                                    title={complaint.adminReview.reason}>
                                    Lý do: {complaint.adminReview.reason}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Xem xét khiếu nại - #{selectedComplaint.orderCode}
              </h3>
            </div>

            <div className="p-6">
              {/* Complaint Details */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Thông tin khiếu nại
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Khách hàng:</p>
                      <p className="font-medium">
                        {selectedComplaint.customer?.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kỹ thuật viên:</p>
                      <p className="font-medium">
                        {selectedComplaint.technician?.account?.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dịch vụ:</p>
                      <p className="font-medium">
                        {selectedComplaint.service?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Giá trị:</p>
                      <p className="font-medium">
                        {formatPrice(selectedComplaint.price?.amount || 0)} đ
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Lý do khiếu nại:</p>
                    <p className="font-medium">
                      {selectedComplaint.customerConfirmation?.complaintReason}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mô tả chi tiết:</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {
                        selectedComplaint.customerConfirmation
                          ?.complaintDescription
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quyết định xử lý *
                  </label>
                  <select
                    value={reviewDecision}
                    onChange={(e) => handleReviewDecisionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Chọn quyết định...</option>
                    <option value="approved">
                      Duyệt khiếu nại (Tạo phiếu bảo hành)
                    </option>
                    <option value="rejected">Từ chối khiếu nại</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do quyết định *
                  </label>
                  <textarea
                    value={reviewReason}
                    onChange={(e) => setReviewReason(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập lý do cho quyết định của bạn..."
                  />
                </div>

                {/* Technician Selection (only show if approving) */}
                {reviewDecision === "approved" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn kỹ thuật viên mới *
                      </label>
                      {loadingTechnicians ? (
                        <div className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-gray-50">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            Đang tìm kỹ thuật viên phù hợp...
                          </span>
                        </div>
                      ) : (
                        <select
                          value={selectedTechnician}
                          onChange={(e) =>
                            handleTechnicianChange(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">
                            {availableTechnicians.length === 0
                              ? "Không có kỹ thuật viên phù hợp"
                              : "Chọn kỹ thuật viên..."}
                          </option>
                          {availableTechnicians.map((tech) => (
                            <option key={tech._id} value={tech._id}>
                              {tech.fullName} - {tech.district} - {tech.rating}
                              ⭐ ({tech.completedJobs} công việc)
                            </option>
                          ))}
                        </select>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Kỹ thuật viên được chọn sẽ thực hiện dịch vụ bảo hành
                        miễn phí
                      </p>
                    </div>

                    {/* Date Selection */}
                    {selectedTechnician && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chọn ngày thực hiện *
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Time Slot Selection */}
                    {selectedDate && availableTimeSlots.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chọn khung giờ *
                        </label>
                        <select
                          value={selectedTimeSlot}
                          onChange={(e) => setSelectedTimeSlot(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Chọn khung giờ...</option>
                          {availableTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* No available slots message */}
                    {selectedDate && availableTimeSlots.length === 0 && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Không có khung giờ trống trong ngày này. Vui lòng chọn
                        ngày khác.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                  Hủy
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={loading || !reviewDecision || !reviewReason}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Đang xử lý..." : "Xác nhận quyết định"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
