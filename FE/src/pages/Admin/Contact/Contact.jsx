import {
  Layout,
  Table,
  Button,
  Modal,
  Tag,
  notification,
  Input,
  Typography,
  Avatar,
  Tooltip,
  Empty,
  Skeleton,
  Badge,
  Card,
  Select,
  Progress,
  Tabs,
  Dropdown,
  DatePicker,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  DeleteOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  MailFilled,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  FilterOutlined,
  CalendarOutlined,
  MoreOutlined,
  SortAscendingOutlined,
  RobotOutlined,
  TeamOutlined,
  HistoryOutlined,
  PieChartOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  DownloadOutlined,
  ReloadOutlined,
  BellOutlined,
} from "@ant-design/icons";

import Sidebar from "../../../components/SideBarAdmin/Sidebar";
import { useEffect, useState } from "react";
import {
  delById,
  addItems,
  getDataByParams,
} from "../../../services/custom.api";

import EmailModal from "../../../components/EmailModal/EmailModal";
import "../../../components/EmailModal/EmailModal.css";
const { Content, Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function Contact() {
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [dataContact, setDataContact] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const onTabChange = (key) => {
    setActiveTab(key);
    if (key === "all") {
      setFilteredContacts(dataContact);
    } else if (key === "replied") {
      setFilteredContacts(dataContact.filter((contact) => contact.status));
    } else if (key === "pending") {
      setFilteredContacts(dataContact.filter((contact) => !contact.status));
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const getStringAvatar = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name[0];
  };

  const columns = [
    {
      title: "Người Liên Hệ",
      render: (record) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              style={{
                background: record.status
                  ? "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)"
                  : "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              {getStringAvatar(record.fullname)}
            </Avatar>
            <div>
              <div className="font-medium text-gray-800">{record.fullname}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <CalendarOutlined style={{ fontSize: "10px" }} />
                {/* This is a placeholder - in a real app, you'd display the actual date */}
                {new Date().toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Thông Tin Liên Hệ",
      render: (record) => {
        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MailFilled
                className="text-blue-500"
                style={{ fontSize: "12px" }}
              />
              <Text className="text-gray-600">{record.email}</Text>
            </div>
            <div className="flex items-center gap-2">
              <PhoneOutlined
                className="text-green-500"
                style={{ fontSize: "12px" }}
              />
              <Text className="text-gray-600">{record.phone}</Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Dịch Vụ",
      render: (record) => {
        console.log("Service data:", record.service); // Debug log

        if (
          record.service &&
          typeof record.service === "object" &&
          record.service.name
        ) {
          return (
            <div className="space-y-1">
              <div className="font-medium text-gray-800">
                {record.service.name}
              </div>
              <div className="text-xs text-gray-500">
                {record.service.category}
              </div>
              <div className="text-xs text-blue-600 font-medium">
                {record.service.basePrice?.toLocaleString("vi-VN")} VNĐ
              </div>
            </div>
          );
        } else if (record.service && typeof record.service === "string") {
          return (
            <Tag color="orange" className="text-xs">
              Service ID: {record.service.substring(0, 8)}...
            </Tag>
          );
        } else {
          return (
            <Tag color="default" className="text-xs">
              Chưa chọn dịch vụ
            </Tag>
          );
        }
      },
    },
    {
      title: "Lời Nhắn",
      width: "25%",
      render: (record) => {
        return (
          <div className="max-h-24 overflow-y-auto pr-2 text-gray-600 custom-scrollbar">
            {record.message}
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",
      render: (record) => {
        if (record.status == true) {
          return (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
              Đã phản hồi
            </Tag>
          );
        } else {
          return (
            <Tag
              icon={<CloseCircleOutlined />}
              color="error"
              className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
              Chưa phản hồi
            </Tag>
          );
        }
      },
    },
    {
      title: "Thao Tác",
      render: (record) => {
        return (
          <div className="flex gap-2">
            <Tooltip title="Gửi email phản hồi">
              <Button
                type="primary"
                shape="circle"
                icon={<MailOutlined />}
                onClick={() => showEmailModal(record)}
                className="flex items-center justify-center"
                style={{
                  background: record.status ? "#52c41a" : "#4096ff",
                  borderColor: record.status ? "#52c41a" : "#4096ff",
                }}
              />
            </Tooltip>
            <Tooltip title="Xóa liên hệ">
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={(e) => showDel(e, record._id)}
                className="flex items-center justify-center"
              />
            </Tooltip>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Chi tiết liên hệ",
                    icon: <UserSwitchOutlined />,
                    onClick: () => {
                      notification.info({
                        message: "Thông báo",
                        description:
                          "Chức năng chi tiết liên hệ đang được phát triển",
                      });
                    },
                  },
                  {
                    key: "2",
                    label: "Đánh dấu đã phản hồi",
                    icon: <CheckCircleOutlined />,
                    disabled: record.status,
                    onClick: () => handleUpdateStatus(record._id, true),
                  },
                  {
                    key: "3",
                    label: "Đánh dấu chưa phản hồi",
                    icon: <CloseCircleOutlined />,
                    disabled: !record.status,
                    onClick: () => handleUpdateStatus(record._id, false),
                  },
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
        );
      },
    },
  ];

  useEffect(() => {
    getDataContact();
  }, [sendEmail]);

  useEffect(() => {
    if (searchValue) {
      let filtered = [];
      if (activeTab === "all") {
        filtered = dataContact.filter(
          (contact) =>
            contact.fullname
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            contact.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
            contact.phone?.includes(searchValue) ||
            contact.service?.name
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            contact.service?.category
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())
        );
      } else if (activeTab === "replied") {
        filtered = dataContact.filter(
          (contact) =>
            contact.status &&
            (contact.fullname
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
              contact.email
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              contact.phone?.includes(searchValue) ||
              contact.service?.name
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              contact.service?.category
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()))
        );
      } else if (activeTab === "pending") {
        filtered = dataContact.filter(
          (contact) =>
            !contact.status &&
            (contact.fullname
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
              contact.email
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              contact.phone?.includes(searchValue) ||
              contact.service?.name
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              contact.service?.category
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()))
        );
      }

      setFilteredContacts(filtered);
    } else {
      if (activeTab === "all") {
        setFilteredContacts(dataContact);
      } else if (activeTab === "replied") {
        setFilteredContacts(dataContact.filter((contact) => contact.status));
      } else if (activeTab === "pending") {
        setFilteredContacts(dataContact.filter((contact) => !contact.status));
      }
    }
  }, [searchValue, dataContact, activeTab]);

  const getDataContact = async () => {
    setLoading(true);
    await getDataByParams("contact/all-contact")
      .then((res) => {
        console.log(res.data);
        setDataContact(res.data);
        setFilteredContacts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu liên hệ. Vui lòng thử lại sau.",
        });
      });
  };

  // Delete Contact
  const [contactId, setContactId] = useState("");
  const [delOpen, setDelOpen] = useState(false);

  const showDel = async (e, id) => {
    e.stopPropagation();
    setContactId(id);
    setDelOpen(true);
  };

  const handleDel = async () => {
    setDelOpen(false);
    setLoading(true);

    await delById(`contact/delete-contact/${contactId}`)
      .then(async (res) => {
        await getDataContact();
        notification[res.status == 200 ? "success" : "error"]({
          message: res.status == 200 ? "Thành công" : "Lỗi",
          description: res.data.msg,
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        notification.error({
          message: "Lỗi",
          description: "Không thể xóa liên hệ. Vui lòng thử lại sau.",
        });
      });
  };

  // Email Modal
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [currentContact, setCurrentContact] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const showEmailModal = (record) => {
    setCurrentContact(record);
    setEmailModalVisible(true);
  };

  const handleSendEmail = async () => {
    if (!currentContact) return;
    setSendingEmail(true);

    const emailData = {
      to: currentContact.email,
      subject: "Phản hồi khách hàng từ KCare.",
      text: emailContent,
    };

    await addItems("admin/reply-customer-email", emailData)
      .then(() => {
        setEmailModalVisible(false);
        setEmailContent("");
        notification.success({
          message: "Thành công",
          description: "Email phản hồi đã được gửi thành công.",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
        setSendEmail(!sendEmail);
        setSendingEmail(false);
      })
      .catch(() => {
        setSendingEmail(false);
        notification.error({
          message: "Lỗi",
          description: "Không thể gửi email. Vui lòng thử lại sau.",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        });
      });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  // Interactive progress value calculations
  const repliedPercentage =
    dataContact.length > 0
      ? Math.round(
          (dataContact.filter((contact) => contact.status).length /
            dataContact.length) *
            100
        )
      : 0;

  const pendingPercentage = 100 - repliedPercentage;

  // Time period options for filter
  const timeOptions = [
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
    { value: "all", label: "Tất cả" },
  ];

  // Additional handler functions
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: "Xác nhận xóa hàng loạt",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} liên hệ đã chọn?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        setLoading(true);
        try {
          // Giả sử có API bulk delete
          await Promise.all(
            selectedRowKeys.map((id) => delById(`contact/delete-contact/${id}`))
          );
          await getDataContact();
          setSelectedRowKeys([]);
          notification.success({
            message: "Thành công",
            description: `Đã xóa ${selectedRowKeys.length} liên hệ`,
          });
        } catch {
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa liên hệ. Vui lòng thử lại sau.",
          });
        }
        setLoading(false);
      },
    });
  };

  const handleExportData = (type) => {
    const dataToExport =
      type === "selected"
        ? dataContact.filter((contact) => selectedRowKeys.includes(contact._id))
        : dataContact;

    if (dataToExport.length === 0) {
      notification.warning({
        message: "Cảnh báo",
        description: "Không có dữ liệu để xuất",
      });
      return;
    }

    // Convert data to CSV format
    const headers = [
      "Họ tên",
      "Email",
      "Số điện thoại",
      "Dịch vụ",
      "Lời nhắn",
      "Trạng thái",
      "Ngày tạo",
    ];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((contact) =>
        [
          `"${contact.fullname || ""}"`,
          `"${contact.email || ""}"`,
          `"${contact.phone || ""}"`,
          `"${contact.service?.name || "Chưa chọn"}"`,
          `"${contact.message || ""}"`,
          `"${contact.status ? "Đã phản hồi" : "Chưa phản hồi"}"`,
          `"${new Date(contact.createdAt).toLocaleDateString("vi-VN")}"`,
        ].join(",")
      ),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `contact-data-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notification.success({
      message: "Thành công",
      description: `Đã xuất ${dataToExport.length} liên hệ`,
    });
  };

  const handleUpdateStatus = async (contactId, newStatus) => {
    try {
      setLoading(true);
      // Giả sử có API update status
      await addItems(`contact/update-status/${contactId}`, {
        status: newStatus,
      });
      await getDataContact();
      notification.success({
        message: "Thành công",
        description: `Đã cập nhật trạng thái thành ${
          newStatus ? "Đã phản hồi" : "Chưa phản hồi"
        }`,
      });
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật trạng thái",
      });
    }
    setLoading(false);
  };

  const handleTimeFilter = (timeValue) => {
    // Implement time filtering logic
    console.log("Time filter:", timeValue);
    notification.info({
      message: "Thông báo",
      description: `Đã áp dụng bộ lọc: ${
        timeOptions.find((opt) => opt.value === timeValue)?.label
      }`,
    });
  };

  const handleDateRangeFilter = (dates) => {
    // Implement date range filtering logic
    if (dates && dates.length === 2) {
      console.log("Date range:", dates);
      notification.info({
        message: "Thông báo",
        description: `Đã áp dụng bộ lọc từ ${dates[0].format(
          "DD/MM/YYYY"
        )} đến ${dates[1].format("DD/MM/YYYY")}`,
      });
    }
  };

  const handleRefreshData = async () => {
    await getDataContact();
    notification.success({
      message: "Thành công",
      description: "Đã làm mới dữ liệu",
    });
  };

  return (
    <div className="bg-[#f5f8ff] min-h-screen">
      <div className="flex">
        <div className="">
          <Sidebar props={4} collapsed={collapsed} onCollapse={setCollapsed} />
        </div>
        <div className="w-full">
          <Layout className="min-h-svh">
            <Content className="m-6 p-0">
              {/* Page title */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <Title level={3} className="!m-0 !text-gray-800">
                    Quản Lý Liên Hệ
                  </Title>
                  <Text type="secondary">
                    Quản lý và phản hồi các liên hệ từ khách hàng
                  </Text>
                </div>

                <div className="mt-4 md:mt-0 flex gap-3">
                  <Select
                    defaultValue="month"
                    style={{ width: 120 }}
                    options={timeOptions}
                    className="text-sm"
                    onChange={handleTimeFilter}
                  />

                  <RangePicker
                    format="DD/MM/YYYY"
                    className="text-sm"
                    placeholder={["Từ ngày", "Đến ngày"]}
                    onChange={handleDateRangeFilter}
                  />
                </div>
              </div>

              {/* Analytics cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl border-none"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mr-4">
                      <TeamOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">
                        Tổng liên hệ
                      </Text>
                      <Title level={3} className="!m-0">
                        {dataContact.length}
                      </Title>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Text className="text-green-500">+12% </Text>
                    <Text className="text-gray-400 ml-1">
                      so với tuần trước
                    </Text>
                  </div>
                </Card>

                <Card
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl border-none"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-500 mr-4">
                      <CheckCircleOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">Đã phản hồi</Text>
                      <Title level={3} className="!m-0">
                        {dataContact.filter((contact) => contact.status).length}
                      </Title>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Text className="text-green-500">
                      +{repliedPercentage}%{" "}
                    </Text>
                    <Text className="text-gray-400 ml-1">tỷ lệ phản hồi</Text>
                  </div>
                </Card>

                <Card
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl border-none"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-500 mr-4">
                      <CloseCircleOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">
                        Chưa phản hồi
                      </Text>
                      <Title level={3} className="!m-0">
                        {
                          dataContact.filter((contact) => !contact.status)
                            .length
                        }
                      </Title>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Text
                      className={
                        pendingPercentage > 30
                          ? "text-red-500"
                          : "text-gray-500"
                      }>
                      {pendingPercentage}%{" "}
                    </Text>
                    <Text className="text-gray-400 ml-1">cần xử lý</Text>
                  </div>
                </Card>

                <Card
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl border-none"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-500 mr-4">
                      <HistoryOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">
                        Thời gian phản hồi
                      </Text>
                      <Title level={3} className="!m-0">
                        2.4h
                      </Title>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Text className="text-green-500">-15% </Text>
                    <Text className="text-gray-400 ml-1">
                      so với tuần trước
                    </Text>
                  </div>
                </Card>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                {/* Tab Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <Tabs
                    activeKey={activeTab}
                    onChange={onTabChange}
                    className="contact-tabs">
                    <TabPane tab={`Tất cả (${dataContact.length})`} key="all" />
                    <TabPane
                      tab={`Đã phản hồi (${
                        dataContact.filter((contact) => contact.status).length
                      })`}
                      key="replied"
                    />
                    <TabPane
                      tab={`Chưa phản hồi (${
                        dataContact.filter((contact) => !contact.status).length
                      })`}
                      key="pending"
                    />
                  </Tabs>

                  <div className="flex gap-3 items-center w-full md:w-auto">
                    <Search
                      placeholder="Tìm kiếm tên, email, SĐT, dịch vụ..."
                      allowClear
                      enterButton={<SearchOutlined className="text-white" />}
                      size="middle"
                      className="max-w-96"
                      onChange={(e) => handleSearch(e.target.value)}
                    />

                    <Tooltip title="Lọc danh sách">
                      <Button
                        icon={<FilterOutlined />}
                        size="middle"
                        className="flex items-center justify-center"
                        onClick={() => {
                          notification.info({
                            message: "Thông báo",
                            description:
                              "Chức năng lọc nâng cao đang được phát triển",
                          });
                        }}
                      />
                    </Tooltip>

                    <Tooltip title="Làm mới dữ liệu">
                      <Button
                        icon={<ReloadOutlined />}
                        size="middle"
                        className="flex items-center justify-center"
                        onClick={handleRefreshData}
                      />
                    </Tooltip>

                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "1",
                            label: "Xuất tất cả dữ liệu",
                            icon: <DownloadOutlined />,
                            onClick: () => handleExportData("all"),
                          },
                          {
                            key: "2",
                            label: "Xuất dữ liệu đã chọn",
                            icon: <CheckCircleOutlined />,
                            disabled: !hasSelected,
                            onClick: () => handleExportData("selected"),
                          },
                        ],
                      }}>
                      <Button
                        icon={<ExportOutlined />}
                        size="middle"
                        className="flex items-center justify-center">
                        Xuất
                      </Button>
                    </Dropdown>
                  </div>
                </div>

                {/* Response progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <Text className="text-gray-500">Tiến độ phản hồi</Text>
                    <Text className="text-gray-500">{repliedPercentage}%</Text>
                  </div>
                  <Progress
                    percent={repliedPercentage}
                    strokeColor="#52c41a"
                    showInfo={false}
                    className="contact-progress"
                  />
                </div>

                {/* Table actions */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    {hasSelected && (
                      <div className="flex items-center space-x-2">
                        <Text>{`Đã chọn ${selectedRowKeys.length} mục`}</Text>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => setSelectedRowKeys([])}>
                          Bỏ chọn
                        </Button>
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={handleBulkDelete}>
                          Xóa
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Text className="text-gray-500 text-sm">Sắp xếp:</Text>
                    <Button
                      type="text"
                      icon={<SortAscendingOutlined />}
                      size="small">
                      Mới nhất
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="p-4">
                    <Skeleton active paragraph={{ rows: 5 }} />
                  </div>
                ) : (
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredContacts}
                    rowKey="_id"
                    pagination={{
                      pageSize: 8,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} liên hệ`,
                      showSizeChanger: true,
                      pageSizeOptions: ["8", "16", "24"],
                    }}
                    className="contact-table"
                    rowClassName={(record) =>
                      record.status ? "bg-white" : "bg-gray-50"
                    }
                    onRow={() => ({
                      className:
                        "hover:bg-blue-50 transition-colors cursor-pointer",
                    })}
                    locale={{
                      emptyText: (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="Không có liên hệ nào"
                        />
                      ),
                    }}
                  />
                )}
              </div>

              {/* Quick stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <PieChartOutlined className="text-blue-500" />
                      <span>Top Liên Hệ</span>
                    </div>
                  }
                  className="shadow-sm rounded-xl border-none"
                  extra={<Button type="text" icon={<MoreOutlined />} />}>
                  {dataContact.slice(0, 3).map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center py-2 border-b last:border-b-0">
                      <Avatar
                        size={32}
                        style={{
                          background: contact.status
                            ? "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)"
                            : "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)",
                        }}>
                        {getStringAvatar(contact.fullname)}
                      </Avatar>
                      <div className="ml-3">
                        <Text className="block text-sm">
                          {contact.fullname}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {contact.email}
                        </Text>
                      </div>
                      <Tag
                        color={contact.status ? "success" : "error"}
                        className="ml-auto text-xs">
                        {contact.status ? "Đã phản hồi" : "Chưa phản hồi"}
                      </Tag>
                    </div>
                  ))}
                </Card>

                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <RobotOutlined className="text-purple-500" />
                      <span>Phân Tích Phản Hồi</span>
                    </div>
                  }
                  className="shadow-sm rounded-xl border-none"
                  extra={<Button type="text" icon={<MoreOutlined />} />}>
                  <div className="py-2 mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Email phản hồi</span>
                      <span className="font-medium">
                        {Math.round(repliedPercentage)}%
                      </span>
                    </div>
                    <Progress
                      percent={repliedPercentage}
                      strokeColor="#4096ff"
                      size="small"
                    />
                  </div>

                  <div className="py-2 mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Liên hệ đang chờ</span>
                      <span className="font-medium">{pendingPercentage}%</span>
                    </div>
                    <Progress
                      percent={pendingPercentage}
                      strokeColor="#ff4d4f"
                      size="small"
                    />
                  </div>

                  <div className="py-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tỷ lệ chuyển đổi</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <Progress percent={76} strokeColor="#52c41a" size="small" />
                  </div>
                </Card>

                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <SettingOutlined className="text-orange-500" />
                      <span>Tác Vụ Nhanh</span>
                    </div>
                  }
                  className="shadow-sm rounded-xl border-none">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="default"
                      icon={<MailOutlined />}
                      className="flex items-center justify-center"
                      block
                      onClick={() => {
                        if (selectedRowKeys.length === 0) {
                          notification.warning({
                            message: "Cảnh báo",
                            description:
                              "Vui lòng chọn ít nhất một liên hệ để gửi email hàng loạt",
                          });
                        } else {
                          notification.info({
                            message: "Thông báo",
                            description:
                              "Chức năng email hàng loạt đang được phát triển",
                          });
                        }
                      }}>
                      Email hàng loạt
                    </Button>

                    <Button
                      type="default"
                      icon={<UserSwitchOutlined />}
                      className="flex items-center justify-center"
                      block
                      onClick={() => {
                        notification.info({
                          message: "Thông báo",
                          description:
                            "Chức năng phân loại tự động đang được phát triển",
                        });
                      }}>
                      Phân loại
                    </Button>

                    <Button
                      type="default"
                      icon={<ExportOutlined />}
                      className="flex items-center justify-center"
                      block
                      onClick={() => handleExportData("all")}>
                      Xuất dữ liệu
                    </Button>

                    <Button
                      type="default"
                      icon={<SettingOutlined />}
                      className="flex items-center justify-center"
                      block
                      onClick={() => {
                        notification.info({
                          message: "Thông báo",
                          description: "Chức năng cài đặt đang được phát triển",
                        });
                      }}>
                      Cài đặt
                    </Button>
                  </div>
                </Card>
              </div>
            </Content>
          </Layout>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-500">
            <ExclamationCircleOutlined />
            <span>Xác nhận xóa liên hệ</span>
          </div>
        }
        open={delOpen}
        onOk={handleDel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
          style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" },
        }}
        onCancel={() => setDelOpen(false)}
        centered
        className="delete-modal">
        <div className="py-4">
          <p className="text-gray-600">
            Thông tin liên hệ sẽ bị xóa và không thể khôi phục. Bạn có chắc chắn
            muốn tiếp tục?
          </p>
        </div>
      </Modal>

      {/* Email Modal - You'd need to update your EmailModal component separately */}
      <EmailModal
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        onSend={handleSendEmail}
        emailContent={emailContent}
        setEmailContent={setEmailContent}
        currentContact={currentContact}
        sendingEmail={sendingEmail}
      />

      {/* Custom CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }

        .contact-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          color: #4b5563;
          font-weight: 600;
        }
        
        .contact-table .ant-table {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .contact-tabs .ant-tabs-tab {
          transition: all 0.3s;
          padding: 8px 16px;
          margin: 0 8px 0 0;
        }
        
        .contact-tabs .ant-tabs-tab-active {
          background-color: rgba(24, 144, 255, 0.1);
          border-radius: 6px;
        }
        
        .contact-tabs .ant-tabs-ink-bar {
          display: none;
        }
        
        .contact-progress .ant-progress-bg {
          height: 8px !important;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default Contact;
