import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  Card,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge,
  Skeleton,
  Dropdown,
  Empty,
  Divider,
  Typography,
} from "antd";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiList,
  FiUser,
  FiBriefcase,
  FiDollarSign,
} from "react-icons/fi";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
  ReloadOutlined,
  MoreOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import Sidebar from "../../../components/SideBarAdmin/Sidebar";
import { useNotification } from "../../../contexts/NotificationContext";
import {
  getItems,
  updateItem,
  delById,
  addItems,
} from "../../../services/custom.api";

const { Option } = Select;
const { Title, Text } = Typography;
const { Search } = Input;

function Technicians() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [technicians, setTechnicians] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [editSelectedServices, setEditSelectedServices] = useState([]);

  // Mock data cho kỹ thuật viên

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    getTechnicians();
    getServices();
  }, []);
  const getTechnicians = async () => {
    const res = await getItems("admin/get-all-technicians");
    console.log(res);
    if (res.status === 200) {
      setTechnicians(res.data);
    } else {
      showNotification("error", res.data.msg);
    }
  };

  const getServices = async () => {
    const res = await getItems("admin/get-services");
    if (res.status === 200) {
      setServiceOptions(res.data);
    }
  };
  // Calculate statistics
  const approvedCount = technicians.filter(
    (tech) => tech.status === "active"
  ).length;
  const pendingCount = technicians.filter(
    (tech) => tech.status === "pending"
  ).length;
  const _suspendedCount = technicians.filter(
    (tech) => tech.status === "suspended"
  ).length;
  const _bannedCount = technicians.filter(
    (tech) => tech.status === "banned"
  ).length;
  const approvedPercentage =
    technicians.length > 0
      ? Math.round((approvedCount / technicians.length) * 100)
      : 0;

  // Filter technicians
  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch =
      tech.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
      tech.services.some((service) =>
        service.toLowerCase().includes(searchValue.toLowerCase())
      ) ||
      tech.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      tech.phone.includes(searchValue);
    const matchesStatus =
      filterStatus === "all" || tech.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleAddTechnician = () => {
    setSelectedServices([]);
    setAddModalOpen(true);
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) => {
      const isCurrentlySelected = prev.includes(serviceId);
      if (isCurrentlySelected) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleEditServiceToggle = (serviceId) => {
    setEditSelectedServices((prev) => {
      const isCurrentlySelected = prev.includes(serviceId);
      if (isCurrentlySelected) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

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
    "Củ Chi",
    "Hóc Môn",
    "Bình Chánh",
    "Nhà Bè",
    "Cần Giờ",
  ];

  const handleEditTechnician = (record) => {
    setSelectedTechnician(record);
    // Set services đã chọn cho edit
    const technicianServiceIds =
      record.services?.map((service) => service._id || service.id) || [];
    setEditSelectedServices(technicianServiceIds);
    setEditModalOpen(true);
  };

  const handleDeleteTechnician = async (id) => {
    try {
      const res = await delById(`admin/delete-technician/${id}`);
      showNotification("success", res.data.msg);
      getTechnicians(); // Refresh data
    } catch (error) {
      console.error("Delete technician error:", error);
      showNotification("error", "Có lỗi xảy ra khi xóa kỹ thuật viên");
    }
  };

  const handleApproveTechnician = async (id, action) => {
    try {
      setSubmitLoading(true);
      const endpoint =
        action === "approve"
          ? `admin/approve-technician/${id}`
          : `admin/reject-technician/${id}`;
      await updateItem(endpoint, {});
      showNotification(
        "success",
        `Đã ${
          action === "approve" ? "duyệt" : "từ chối"
        } kỹ thuật viên thành công`
      );
      getTechnicians();
    } catch (error) {
      console.error("Approve/reject technician error:", error);
      showNotification("error", "Có lỗi xảy ra");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSuspendTechnician = async (id) => {
    try {
      setSubmitLoading(true);
      const endpoint = `admin/suspend-technician/${id}`;
      await updateItem(endpoint, {});
      showNotification("success", "Đã tạm ngưng kỹ thuật viên thành công");
      getTechnicians();
    } catch (error) {
      console.error("Suspend technician error:", error);
      showNotification("error", "Có lỗi xảy ra khi tạm ngưng kỹ thuật viên");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBanTechnician = async (id) => {
    try {
      setSubmitLoading(true);
      const endpoint = `admin/ban-technician/${id}`;
      await updateItem(endpoint, {});
      showNotification("success", "Đã cấm tài khoản kỹ thuật viên thành công");
      getTechnicians();
    } catch (error) {
      console.error("Ban technician error:", error);
      showNotification(
        "error",
        "Có lỗi xảy ra khi cấm tài khoản kỹ thuật viên"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleActivateTechnician = async (id) => {
    try {
      setSubmitLoading(true);
      const endpoint = `admin/activate-technician/${id}`;
      await updateItem(endpoint, {});
      showNotification("success", "Đã kích hoạt lại kỹ thuật viên thành công");
      getTechnicians();
    } catch (error) {
      console.error("Activate technician error:", error);
      showNotification(
        "error",
        "Có lỗi xảy ra khi kích hoạt lại kỹ thuật viên"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUnbanTechnician = async (id) => {
    try {
      setSubmitLoading(true);
      const endpoint = `admin/unban-technician/${id}`;
      await updateItem(endpoint, {});
      showNotification("success", "Đã bỏ cấm kỹ thuật viên thành công");
      getTechnicians();
    } catch (error) {
      console.error("Unban technician error:", error);
      showNotification("error", "Có lỗi xảy ra khi bỏ cấm kỹ thuật viên");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCreateTechnician = async (data) => {
    if (selectedServices.length === 0) {
      showNotification("error", "Vui lòng chọn ít nhất một dịch vụ!");
      return;
    }

    try {
      setSubmitLoading(true);
      const technicianData = {
        ...data,
        services: selectedServices,
      };
      await addItems("admin/create-technician", technicianData);
      console.log(technicianData);
      showNotification("success", "Thêm kỹ thuật viên thành công");
      setAddModalOpen(false);
      setSelectedServices([]);
      getTechnicians();
    } catch (error) {
      console.error("Create technician error:", error);
      showNotification("error", "Có lỗi xảy ra khi thêm kỹ thuật viên");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateTechnician = async (data) => {
    if (editSelectedServices.length === 0) {
      showNotification("error", "Vui lòng chọn ít nhất một dịch vụ!");
      return;
    }

    try {
      setSubmitLoading(true);
      const updateData = {
        ...data,
        services: editSelectedServices,
      };
      await updateItem(
        `admin/update-technician/${selectedTechnician._id}`,
        updateData
      );
      showNotification("success", "Cập nhật kỹ thuật viên thành công");
      setEditModalOpen(false);
      setSelectedTechnician(null);
      setEditSelectedServices([]);
      getTechnicians();
    } catch (error) {
      console.error("Update technician error:", error);
      showNotification("error", "Có lỗi xảy ra khi cập nhật kỹ thuật viên");
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: "Kỹ thuật viên",
      width: "25%",
      key: "fullName",
      render: (record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.account.avatar}
            size={48}
            shape="square"
            className="rounded-lg border border-gray-200"
          />
          <div>
            <div className="font-medium text-gray-800">{record.fullName}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <UserOutlined style={{ fontSize: "10px" }} />
              {record.createdAt
                ? new Date(record.createdAt).toLocaleDateString("vi-VN")
                : "Chưa có ngày"}
            </div>
            <div className="flex items-center mt-1">
              <FiStar className="text-yellow-400 w-3 h-3" />
              <span className="ml-1 text-xs text-gray-600">
                {record.rating}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ & Khu vực",
      width: "25%",
      key: "contact",
      render: (record) => (
        <div>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <FiPhone className="w-4 h-4 mr-2" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <FiMail className="w-4 h-4 mr-2" />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span>{record.district}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      width: "20%",
      key: "services",
      render: (record) => (
        <div className="flex flex-wrap gap-1">
          {record.services?.map((service, index) => (
            <Tag key={index} color="blue" className="text-xs">
              {service.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      width: "15%",
      key: "status",
      render: (record) => {
        const statusConfig = {
          active: {
            color: "success",
            icon: <CheckCircleOutlined />,
            text: "Đã duyệt",
          },
          pending: {
            color: "warning",
            icon: <ClockCircleOutlined />,
            text: "Chờ duyệt",
          },
          rejected: {
            color: "error",
            icon: <StopOutlined />,
            text: "Từ chối",
          },
          suspended: {
            color: "default",
            icon: <StopOutlined />,
            text: "Tạm ngưng",
          },
          banned: {
            color: "error",
            icon: <StopOutlined />,
            text: "Bị cấm",
          },
        };

        const config = statusConfig[record.status] || {
          color: "default",
          icon: <ClockCircleOutlined />,
          text: record.status || "Không xác định",
        };

        return (
          <Tag
            icon={config.icon}
            color={config.color}
            className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      width: "15%",
      key: "action",
      render: (record) => (
        <div className="flex gap-2">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              className="flex items-center justify-center"
              style={{ background: "#4096ff", borderColor: "#4096ff" }}
              onClick={() => handleEditTechnician(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteTechnician(record._id)}
              className="flex items-center justify-center"
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Xem chi tiết", icon: <EyeOutlined /> },
                {
                  key: "2",
                  label: "Xem lịch sử",
                  icon: <ClockCircleOutlined />,
                },
                ...(record.status === "pending"
                  ? [
                      { type: "divider" },
                      {
                        key: "approve",
                        label: "Duyệt kỹ thuật viên",
                        icon: <CheckCircleOutlined />,
                        onClick: () =>
                          handleApproveTechnician(record._id, "approve"),
                      },
                      {
                        key: "reject",
                        label: "Từ chối",
                        icon: <StopOutlined />,
                        onClick: () =>
                          handleApproveTechnician(record._id, "reject"),
                      },
                    ]
                  : []),
                ...(record.status === "active"
                  ? [
                      { type: "divider" },
                      {
                        key: "suspend",
                        label: "Tạm ngưng",
                        icon: <StopOutlined />,
                        onClick: () => handleSuspendTechnician(record._id),
                      },
                      {
                        key: "ban",
                        label: "Cấm tài khoản",
                        icon: <StopOutlined />,
                        danger: true,
                        onClick: () => handleBanTechnician(record._id),
                      },
                    ]
                  : []),
                ...(record.status === "suspended"
                  ? [
                      { type: "divider" },
                      {
                        key: "activate",
                        label: "Kích hoạt lại",
                        icon: <CheckCircleOutlined />,
                        onClick: () => handleActivateTechnician(record._id),
                      },
                      {
                        key: "ban",
                        label: "Cấm tài khoản",
                        icon: <StopOutlined />,
                        danger: true,
                        onClick: () => handleBanTechnician(record._id),
                      },
                    ]
                  : []),
                ...(record.status === "banned"
                  ? [
                      { type: "divider" },
                      {
                        key: "unban",
                        label: "Bỏ cấm",
                        icon: <CheckCircleOutlined />,
                        onClick: () => handleUnbanTechnician(record._id),
                      },
                    ]
                  : []),
              ],
            }}
            trigger={["click"]}
            placement="bottomRight">
            <Button
              type="text"
              shape="circle"
              icon={<MoreOutlined />}
              className="flex items-center justify-center"
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-[#f5f8ff] min-h-screen">
        <div className="flex">
          <div className="flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 min-w-0">
            <div className="min-h-svh">
              <div className="m-6 p-0">
                {/* Breadcrumb */}
                <div className="mb-6">
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <a
                      href="/admin"
                      className="hover:text-blue-500 transition-colors">
                      Dashboard
                    </a>
                    <span className="px-1">/</span>
                    <span className="text-gray-700">Quản lý kỹ thuật viên</span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <Title
                        level={3}
                        className="!m-0 !text-gray-800 flex items-center gap-2">
                        <TeamOutlined className="text-blue-500" />
                        Quản Lý Kỹ Thuật Viên
                        <Badge
                          count={technicians.length}
                          style={{
                            backgroundColor: "#3b82f6",
                            marginLeft: "8px",
                          }}
                          className="ml-2"
                        />
                      </Title>
                      <Text type="secondary">
                        Quản lý và theo dõi kỹ thuật viên trong hệ thống
                      </Text>
                    </div>

                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      size="large"
                      onClick={handleAddTechnician}
                      className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 border-none hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all">
                      Thêm Kỹ Thuật Viên
                    </Button>
                  </div>
                </div>

                {/* Analytics cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card
                    className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                    bodyStyle={{ padding: "0" }}>
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                          <TeamOutlined style={{ fontSize: "24px" }} />
                        </div>
                        <div>
                          <Text className="text-gray-500 text-sm">
                            Tổng kỹ thuật viên
                          </Text>
                          <Title level={3} className="!m-0">
                            {technicians.length}
                          </Title>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                        <Text className="text-green-500 flex items-center">
                          <LineChartOutlined className="mr-1" /> +12%
                        </Text>
                        <Text className="text-gray-400 ml-1">
                          so với tháng trước
                        </Text>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                    bodyStyle={{ padding: "0" }}>
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-500">
                          <CheckCircleOutlined style={{ fontSize: "24px" }} />
                        </div>
                        <div>
                          <Text className="text-gray-500 text-sm">
                            Đã duyệt
                          </Text>
                          <Title level={3} className="!m-0">
                            {approvedCount}
                          </Title>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                        <Text className="text-green-500 flex items-center">
                          {approvedPercentage}%
                        </Text>
                        <Text className="text-gray-400 ml-1">
                          tổng kỹ thuật viên
                        </Text>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                    bodyStyle={{ padding: "0" }}>
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500">
                          <ClockCircleOutlined style={{ fontSize: "24px" }} />
                        </div>
                        <div>
                          <Text className="text-gray-500 text-sm">
                            Chờ duyệt
                          </Text>
                          <Title level={3} className="!m-0">
                            {pendingCount}
                          </Title>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                        <Text className="text-orange-500 flex items-center">
                          {100 - approvedPercentage}%
                        </Text>
                        <Text className="text-gray-400 ml-1">
                          tổng kỹ thuật viên
                        </Text>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Main content card */}
                <Card className="shadow-md rounded-xl border-none mb-6 overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex-1 w-full md:max-w-md">
                      <Search
                        placeholder="Tìm kiếm tên, email, số điện thoại..."
                        allowClear
                        enterButton={
                          <Button
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500">
                            <SearchOutlined className="text-white" />
                          </Button>
                        }
                        size="large"
                        className="w-full"
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 items-center">
                      <Select
                        value={filterStatus}
                        onChange={(value) => setFilterStatus(value)}
                        style={{ width: 150 }}
                        size="large">
                        <Option value="all">Tất cả trạng thái</Option>
                        <Option value="active">Đã duyệt</Option>
                        <Option value="pending">Chờ duyệt</Option>
                        <Option value="rejected">Từ chối</Option>
                        <Option value="suspended">Tạm ngưng</Option>
                        <Option value="banned">Bị cấm</Option>
                      </Select>

                      <Dropdown
                        menu={{
                          items: [
                            { key: "1", label: "Mới nhất" },
                            { key: "2", label: "Cũ nhất" },
                            { key: "3", label: "A-Z" },
                          ],
                        }}>
                        <Button
                          size="large"
                          icon={<SortAscendingOutlined />}
                          className="flex items-center">
                          Sắp xếp
                        </Button>
                      </Dropdown>
                    </div>
                  </div>

                  <Divider style={{ margin: "0 0 24px 0" }} />

                  {/* Technicians table */}
                  {loading ? (
                    <div className="p-4">
                      <Skeleton active paragraph={{ rows: 5 }} />
                    </div>
                  ) : filteredTechnicians.length === 0 ? (
                    <Empty
                      description="Không tìm thấy kỹ thuật viên nào"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ) : (
                    <Table
                      columns={columns}
                      dataSource={filteredTechnicians}
                      rowKey="_id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} của ${total} kỹ thuật viên`,
                        className: "!mt-6",
                      }}
                      scroll={{ x: 1200 }}
                      className="technician-table"
                    />
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Technician Modal */}
      <Modal
        title="Tạo Kỹ thuật viên mới"
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          setSelectedServices([]);
        }}
        footer={null}
        width={800}>
        <Form layout="vertical" onFinish={handleCreateTechnician}>
          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiUser className="text-blue-500" />
              Thông tin cá nhân
            </h3>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ tên!" },
                  ]}>
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="CMND/CCCD"
                  name="idNumber"
                  rules={[
                    { required: true, message: "Vui lòng nhập CMND/CCCD!" },
                    {
                      pattern: /^[0-9]{9,12}$/,
                      message: "CMND/CCCD không hợp lệ!",
                    },
                  ]}>
                  <Input placeholder="001234567890" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}>
                  <Input placeholder="example@email.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}>
                  <Input placeholder="0901234567" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
              <Input placeholder="123 Đường ABC, Phường XYZ" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}>
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không khớp!")
                        );
                      },
                    }),
                  ]}>
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Professional Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiBriefcase className="text-purple-500" />
              Thông tin chuyên môn
            </h3>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Khu vực hoạt động"
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện!" },
                  ]}>
                  <Select placeholder="Chọn quận/huyện">
                    {districts.map((district) => (
                      <Option key={district} value={district}>
                        {district}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Kinh nghiệm"
                  name="experience"
                  rules={[
                    { required: true, message: "Vui lòng nhập kinh nghiệm!" },
                  ]}>
                  <Input placeholder="VD: 3 năm sửa chữa điện lạnh" />
                </Form.Item>
              </Col>
            </Row>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Dịch vụ đăng ký <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                {serviceOptions.map((service) => {
                  const serviceId = service._id || service.id;
                  const isSelected = selectedServices.includes(serviceId);

                  return (
                    <label
                      key={serviceId}
                      className={`relative cursor-pointer transition-all duration-200 ${
                        isSelected ? "scale-105" : "hover:scale-102"
                      }`}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => handleServiceToggle(serviceId)}
                      />
                      <div
                        className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-500 text-white border-blue-500 shadow-md"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm text-gray-700"
                        }`}>
                        <div className="text-lg mb-1">🔧</div>
                        <div
                          className={`text-xs font-medium ${
                            isSelected ? "text-white" : "text-gray-800"
                          }`}>
                          {service.name}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isSelected ? "text-white/80" : "text-gray-500"
                          }`}>
                          {service.category}
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="text-white text-xs" />
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              {selectedServices.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Vui lòng chọn ít nhất một dịch vụ
                </p>
              )}
            </div>
          </div>

          {/* Banking Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiDollarSign className="text-green-500" />
              Thông tin ngân hàng
            </h3>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Tên ngân hàng"
                  name="bankName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên ngân hàng!" },
                  ]}>
                  <Input placeholder="VD: Vietcombank" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Số tài khoản"
                  name="bankAccount"
                  rules={[
                    { required: true, message: "Vui lòng nhập số tài khoản!" },
                    {
                      pattern: /^[0-9]{8,20}$/,
                      message: "Số tài khoản không hợp lệ!",
                    },
                  ]}>
                  <Input placeholder="1234567890" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Chủ tài khoản"
                  name="bankOwner"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên chủ tài khoản!",
                    },
                  ]}>
                  <Input placeholder="NGUYEN VAN A" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              size="large"
              onClick={() => {
                setAddModalOpen(false);
                setSelectedServices([]);
              }}
              disabled={submitLoading}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitLoading}
              className="bg-blue-500 hover:bg-blue-600">
              Tạo Kỹ thuật viên
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Technician Modal */}
      <Modal
        title="Chỉnh sửa thông tin Kỹ thuật viên"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedTechnician(null);
          setEditSelectedServices([]);
        }}
        footer={null}
        width={800}>
        {selectedTechnician && (
          <Form
            layout="vertical"
            initialValues={{
              fullName: selectedTechnician.fullName,
              idNumber: selectedTechnician.idNumber,
              email: selectedTechnician.email,
              phone: selectedTechnician.phone,
              address: selectedTechnician.address,
              district: selectedTechnician.district,
              experience: selectedTechnician.experience,
              bankName: selectedTechnician.bankName,
              bankAccount: selectedTechnician.bankAccount,
              bankOwner: selectedTechnician.bankOwner,
            }}
            onFinish={handleUpdateTechnician}>
            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiUser className="text-blue-500" />
                Thông tin cá nhân
              </h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}>
                    <Input placeholder="Nguyễn Văn A" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="CMND/CCCD"
                    name="idNumber"
                    rules={[
                      { required: true, message: "Vui lòng nhập CMND/CCCD!" },
                      {
                        pattern: /^[0-9]{9,12}$/,
                        message: "CMND/CCCD không hợp lệ!",
                      },
                    ]}>
                    <Input placeholder="001234567890" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}>
                    <Input placeholder="example@email.com" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                        message: "Số điện thoại không hợp lệ!",
                      },
                    ]}>
                    <Input placeholder="0901234567" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                <Input placeholder="123 Đường ABC, Phường XYZ" />
              </Form.Item>
            </div>

            {/* Professional Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiBriefcase className="text-purple-500" />
                Thông tin chuyên môn
              </h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Khu vực hoạt động"
                    name="district"
                    rules={[
                      { required: true, message: "Vui lòng chọn quận/huyện!" },
                    ]}>
                    <Select placeholder="Chọn quận/huyện">
                      {districts.map((district) => (
                        <Option key={district} value={district}>
                          {district}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Kinh nghiệm"
                    name="experience"
                    rules={[
                      { required: true, message: "Vui lòng nhập kinh nghiệm!" },
                    ]}>
                    <Input placeholder="VD: 3 năm sửa chữa điện lạnh" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Dịch vụ đăng ký <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  {serviceOptions.map((service) => {
                    const serviceId = service._id || service.id;
                    const isSelected = editSelectedServices.includes(serviceId);

                    return (
                      <label
                        key={serviceId}
                        className={`relative cursor-pointer transition-all duration-200 ${
                          isSelected ? "scale-105" : "hover:scale-102"
                        }`}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => handleEditServiceToggle(serviceId)}
                        />
                        <div
                          className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                            isSelected
                              ? "bg-blue-500 text-white border-blue-500 shadow-md"
                              : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm text-gray-700"
                          }`}>
                          <div className="text-lg mb-1">🔧</div>
                          <div
                            className={`text-xs font-medium ${
                              isSelected ? "text-white" : "text-gray-800"
                            }`}>
                            {service.name}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              isSelected ? "text-white/80" : "text-gray-500"
                            }`}>
                            {service.category}
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <FiCheckCircle className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {editSelectedServices.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Vui lòng chọn ít nhất một dịch vụ
                  </p>
                )}
              </div>
            </div>

            {/* Banking Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiDollarSign className="text-green-500" />
                Thông tin ngân hàng
              </h3>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Tên ngân hàng"
                    name="bankName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên ngân hàng!",
                      },
                    ]}>
                    <Input placeholder="VD: Vietcombank" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Số tài khoản"
                    name="bankAccount"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số tài khoản!",
                      },
                      {
                        pattern: /^[0-9]{8,20}$/,
                        message: "Số tài khoản không hợp lệ!",
                      },
                    ]}>
                    <Input placeholder="1234567890" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Chủ tài khoản"
                    name="bankOwner"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên chủ tài khoản!",
                      },
                    ]}>
                    <Input placeholder="NGUYEN VAN A" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button
                size="large"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedTechnician(null);
                  setEditSelectedServices([]);
                }}
                disabled={submitLoading}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitLoading}
                className="bg-blue-500 hover:bg-blue-600">
                Cập nhật Kỹ thuật viên
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
}

export default Technicians;
