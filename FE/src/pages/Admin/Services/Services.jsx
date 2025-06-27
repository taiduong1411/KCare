import Sidebar from "../../../components/SideBarAdmin/Sidebar";
import {
  Table,
  Button,
  Modal,
  Tag,
  Avatar,
  Radio,
  Typography,
  Input,
  Card,
  Tooltip,
  Badge,
  Skeleton,
  Dropdown,
  Empty,
  Divider,
  Select,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNotification } from "../../../contexts/NotificationContext";
import uploadCloudinary from "../../../services/cloudinary";
import {
  addItems,
  getItems,
  delById,
  updateItem,
} from "../../../services/custom.api";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  FileImageOutlined,
  EyeOutlined,
  ReloadOutlined,
  MoreOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  FileAddOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  DollarOutlined,
  TagsOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

function Services() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const columns = [
    {
      title: "Dịch vụ",
      width: "30%",
      key: "name",
      render: (record) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              src={record.images?.[0]?.url || "/default.png"}
              shape="square"
              className="rounded-lg border border-gray-200"
            />
            <div>
              <div className="font-medium text-gray-800">{record.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <ToolOutlined style={{ fontSize: "10px" }} />
                {record.createdAt
                  ? new Date(record.createdAt).toLocaleDateString("vi-VN")
                  : "Chưa có ngày"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Mô tả & Giá",
      width: "25%",
      key: "description",
      render: (record) => {
        return (
          <div>
            <div className="max-h-16 overflow-y-auto pr-2 text-gray-600 custom-scrollbar line-clamp-2 text-sm mb-2">
              {record.description}
            </div>
            <div className="flex items-center gap-2">
              <DollarOutlined className="text-green-500 text-xs" />
              <span className="font-medium text-green-600">
                {record.basePrice?.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {record.duration} phút
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Hoa Hồng",
      width: "10%",
      key: "commissionRate",
      render: (record) => {
        return (
          <div className="text-center">
            <span className="font-medium text-orange-600">
              {record.commissionRate}%
            </span>
          </div>
        );
      },
    },
    {
      title: "Danh mục",
      width: "15%",
      key: "category",
      render: (record) => {
        return (
          <Tag color="blue" className="text-xs">
            {record.category}
          </Tag>
        );
      },
    },
    {
      title: "Trạng Thái",
      width: "10%",
      key: "status",
      render: (record) => {
        const config = record.isActive
          ? {
              color: "success",
              icon: <CheckCircleOutlined />,
              text: "Hoạt động",
            }
          : { color: "error", icon: <StopOutlined />, text: "Tạm ngưng" };

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
      title: "Thao Tác",
      render: (record) => {
        return (
          <div className="flex gap-2">
            <Tooltip title="Chỉnh sửa dịch vụ">
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                className="flex items-center justify-center"
                style={{
                  background: "#4096ff",
                  borderColor: "#4096ff",
                }}
                onClick={() => showEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Xóa dịch vụ">
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={(e) => showDel(e, record._id)}
                data-id={record._id}
                data-name={record.name}
                data-img={record.images?.[0]?.url || "/default.png"}
                className="flex items-center justify-center"
              />
            </Tooltip>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Xem chi tiết",
                    icon: <EyeOutlined />,
                  },
                  {
                    key: "2",
                    label: record.isActive
                      ? "Tạm ngưng dịch vụ"
                      : "Kích hoạt dịch vụ",
                    icon: record.isActive ? (
                      <StopOutlined />
                    ) : (
                      <CheckCircleOutlined />
                    ),
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

  // handle Radio input
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const [valueStatus, setValueStatus] = useState(true);
  const onChangeStatus = (e) => {
    setValueStatus(e.target.value);
  };

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getDataServices();
  }, []);

  const [dataServices, setDataServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  const getDataServices = async () => {
    setLoading(true);
    const res = await getItems("admin/get-services");
    setDataServices(res.data);
    setLoading(false);
  };

  // Service states
  const [addOpen, setAddOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [file, setFile] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Edit states
  const [editOpen, setEditOpen] = useState(false);
  const [_editingService, setEditingService] = useState(null);
  const [editFile, setEditFile] = useState("");

  // Categories for services
  const [categories] = useState([
    "Điện lạnh",
    "Điện gia dụng",
    "Điện tử",
    "Điện máy",
    "Điện nước",
    "Khác",
  ]);

  const [serviceId, setServiceId] = useState({});

  // Search effect
  useEffect(() => {
    if (searchValue) {
      const filtered = dataServices.filter(
        (service) =>
          service.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          service.description
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          service.category?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(dataServices);
    }
  }, [searchValue, dataServices]);

  const onAddSubmit = async (data) => {
    setSubmitLoading(true);
    const newData = {
      name: data.name,
      description: data.description,
      category: data.category,
      basePrice: data.price,
      duration: parseInt(data.estimatedTime) || 60, // Convert to minutes
      commissionRate: data.commissionRate,
      isActive: valueStatus,
    };
    try {
      if (file) {
        const uploadImg = await uploadCloudinary(file, "KCare/services");
        newData.images = [{ id: uploadImg.public_id, url: uploadImg.url }];
      } else if (value === 2 && data.img_url) {
        newData.images = [{ id: "", url: data.img_url }];
      }

      const res = await addItems("admin/create-service", newData);
      if (res.status === 200) {
        showNotification("success", res.data.msg);
        getDataServices();
        setAddOpen(false);
        resetForm();
      } else {
        showNotification("error", res.data.msg);
      }
    } catch (error) {
      console.log(error);
      showNotification("error", "Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setFile("");
    setValue(1);
    setValueStatus(true);
    setSubmitLoading(false);
  };

  const showEdit = async (record) => {
    setEditingService(record);
    // Pre-populate form với data hiện tại
    reset({
      name: record.name,
      category: record.category,
      price: record.basePrice,
      estimatedTime: record.duration,
      commissionRate: record.commissionRate,
      description: record.description,
      img_url: record.images?.[0]?.url || "",
    });
    setValueStatus(record.isActive);
    setValue(2); // Default to URL input
    setEditOpen(true);
  };

  const onEditSubmit = async (data) => {
    setSubmitLoading(true);
    const updateData = {
      name: data.name,
      description: data.description,
      category: data.category,
      basePrice: data.price,
      duration: parseInt(data.estimatedTime) || 60,
      commissionRate: data.commissionRate,
      isActive: valueStatus,
    };
    console.log(updateData);
    try {
      if (value === 1 && editFile) {
        const uploadImg = await uploadCloudinary(editFile, "KCare/services");
        updateData.images = [{ id: uploadImg.public_id, url: uploadImg.url }];
      } else if (value === 2 && data.img_url) {
        updateData.images = [{ id: "", url: data.img_url }];
      }
      const res = await updateItem(
        `/admin/update-service/${_editingService._id}`,
        updateData
      );
      if (res.status === 200) {
        showNotification("success", res.data.msg);
      } else {
        showNotification("error", res.data.msg);
      }
      setEditOpen(false);
      resetEditForm();
      getDataServices();
    } catch (error) {
      console.log(error);
      showNotification("error", "Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetEditForm = () => {
    reset();
    setEditFile("");
    setValue(1);
    setValueStatus(true);
    setEditingService(null);
    setSubmitLoading(false);
  };

  const showDel = async (e) => {
    e.stopPropagation();
    const data = {
      _id: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name,
      img: e.currentTarget.dataset.img,
    };

    setServiceId(data);
    setDelOpen(true);
  };

  const handleDel = async () => {
    setDelOpen(false);
    try {
      const res = await delById(`admin/delete-service/${serviceId._id}`);
      if (res.status === 200) {
        showNotification("success", res.data.msg);
        getDataServices();
      } else {
        showNotification("error", res.data.msg);
      }
    } catch (err) {
      console.log(err);
      showNotification("error", err.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  // Statistics calculations
  const activeCount = dataServices.filter(
    (service) => service.isActive === true
  ).length;
  const inactiveCount = dataServices.filter(
    (service) => service.isActive === false
  ).length;
  const activePercentage =
    dataServices.length > 0
      ? Math.round((activeCount / dataServices.length) * 100)
      : 0;

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
                <div className="mb-6">
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <a
                      href="/admin"
                      className="hover:text-blue-500 transition-colors">
                      Dashboard
                    </a>
                    <span className="px-1">/</span>
                    <span className="text-gray-700">Quản lý dịch vụ</span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <Title
                        level={3}
                        className="!m-0 !text-gray-800 flex items-center gap-2">
                        <ToolOutlined className="text-blue-500" />
                        Quản Lý Dịch Vụ
                        <Badge
                          count={dataServices.length}
                          style={{
                            backgroundColor: "#3b82f6",
                            marginLeft: "8px",
                          }}
                          className="ml-2"
                        />
                      </Title>
                      <Text type="secondary">
                        Tạo, cập nhật và quản lý dịch vụ sửa chữa
                      </Text>
                    </div>

                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      size="large"
                      onClick={() => setAddOpen(true)}
                      className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 border-none hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all">
                      Tạo Dịch Vụ
                    </Button>
                  </div>
                </div>

                {/* Analytics cards with animation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card
                    className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                    bodyStyle={{ padding: "0" }}>
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                          <ToolOutlined style={{ fontSize: "24px" }} />
                        </div>
                        <div>
                          <Text className="text-gray-500 text-sm">
                            Tổng dịch vụ
                          </Text>
                          <Title level={3} className="!m-0">
                            {dataServices.length}
                          </Title>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                        <Text className="text-green-500 flex items-center">
                          <LineChartOutlined className="mr-1" /> +15%{" "}
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
                            Hoạt động
                          </Text>
                          <Title level={3} className="!m-0">
                            {activeCount}
                          </Title>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                        <Text className="text-green-500 flex items-center">
                          {activePercentage}%{" "}
                        </Text>
                        <Text className="text-gray-400 ml-1">tổng dịch vụ</Text>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                    bodyStyle={{ padding: "0" }}>
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-500">
                          <StopOutlined style={{ fontSize: "24px" }} />
                        </div>
                        <div>
                          <Text className="text-gray-500 text-sm">
                            Tạm ngưng
                          </Text>
                          <Title level={3} className="!m-0">
                            {inactiveCount}
                          </Title>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                        <Text className="text-amber-500 flex items-center">
                          {100 - activePercentage}%{" "}
                        </Text>
                        <Text className="text-gray-400 ml-1">tổng dịch vụ</Text>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="shadow-md rounded-xl border-none mb-6 overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex-1 w-full md:max-w-md">
                      <Search
                        placeholder="Tìm kiếm tên dịch vụ, mô tả..."
                        allowClear
                        enterButton={
                          <Button
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500">
                            <SearchOutlined className="text-white" />
                          </Button>
                        }
                        size="large"
                        className="w-full service-search"
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 items-center">
                      <Dropdown
                        menu={{
                          items: [
                            { key: "1", label: "Tất cả dịch vụ" },
                            { key: "2", label: "Dịch vụ hoạt động" },
                            { key: "3", label: "Dịch vụ tạm ngưng" },
                          ],
                        }}>
                        <Button
                          size="large"
                          icon={<FilterOutlined />}
                          className="flex items-center">
                          Bộ lọc
                        </Button>
                      </Dropdown>

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

                  {/* Services table */}
                  {loading ? (
                    <div className="p-4">
                      <Skeleton active paragraph={{ rows: 5 }} />
                    </div>
                  ) : (
                    <Table
                      columns={columns}
                      dataSource={filteredServices}
                      rowKey="_id"
                      pagination={{
                        pageSize: 8,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} của ${total} dịch vụ`,
                        showSizeChanger: true,
                        pageSizeOptions: ["8", "16", "24"],
                      }}
                      className="service-table"
                      rowClassName={(record, index) =>
                        `${record.isActive ? "bg-white" : "bg-gray-50"} ${
                          index % 2 === 0 ? "bg-blue-50/30" : ""
                        }`
                      }
                      onRow={() => ({
                        className:
                          "hover:bg-blue-50 transition-colors cursor-pointer",
                      })}
                      locale={{
                        emptyText: (
                          <div className="py-8">
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              description={
                                <span className="text-gray-500">
                                  Không có dịch vụ nào
                                </span>
                              }
                            />
                            <div className="text-center mt-4">
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setAddOpen(true)}
                                className="bg-blue-500">
                                Thêm dịch vụ mới
                              </Button>
                            </div>
                          </div>
                        ),
                      }}
                    />
                  )}
                </Card>

                <div className="text-center text-gray-500 text-xs mt-6 pb-6">
                  <ClockCircleOutlined className="mr-1" />
                  Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Service Modal */}
        <Modal
          title={
            <div className="flex items-center gap-3 text-blue-600 pb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ToolOutlined style={{ fontSize: "18px" }} />
              </div>
              <span className="text-lg font-medium">Tạo dịch vụ mới</span>
            </div>
          }
          open={addOpen}
          width="90%"
          style={{
            top: 20,
            maxWidth: "1000px",
            width: "90vw",
          }}
          onCancel={() => {
            setAddOpen(false);
            resetForm();
          }}
          footer={null}
          centered
          styles={{ body: { padding: 0 } }}
          className="add-service-modal">
          <div className="modal-scrollable-content p-6">
            <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 block">
                      Tên Dịch Vụ *
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Vui lòng nhập tên dịch vụ" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Nhập tên dịch vụ"
                          size="large"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-700 block">
                      Danh Mục *
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Vui lòng chọn danh mục" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Chọn danh mục"
                          size="large"
                          className="w-full">
                          {categories.map((category) => (
                            <Option key={category} value={category}>
                              {category}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <span className="text-red-500 text-sm">
                        {errors.category.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="text-sm font-medium text-gray-700 block">
                      Giá Dịch Vụ (VNĐ) *
                    </label>
                    <Controller
                      name="price"
                      control={control}
                      rules={{ required: "Vui lòng nhập giá dịch vụ" }}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          placeholder="Nhập giá dịch vụ"
                          size="large"
                          className="w-full"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          addonAfter="VNĐ"
                        />
                      )}
                    />
                    {errors.price && (
                      <span className="text-red-500 text-sm">
                        {errors.price.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="estimatedTime"
                      className="text-sm font-medium text-gray-700 block">
                      Thời Gian Ước Tính *
                    </label>
                    <Controller
                      name="estimatedTime"
                      control={control}
                      rules={{ required: "Vui lòng nhập thời gian ước tính" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="VD: 1-2 giờ"
                          size="large"
                          className="w-full"
                          prefix={
                            <ClockCircleOutlined className="text-gray-400" />
                          }
                        />
                      )}
                    />
                    {errors.estimatedTime && (
                      <span className="text-red-500 text-sm">
                        {errors.estimatedTime.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="commissionRate"
                      className="text-sm font-medium text-gray-700 block">
                      Tỷ Lệ Hoa Hồng (%) *
                    </label>
                    <Controller
                      name="commissionRate"
                      control={control}
                      rules={{
                        required: "Vui lòng nhập tỷ lệ hoa hồng",
                        min: { value: 0, message: "Tỷ lệ hoa hồng phải từ 0%" },
                        max: {
                          value: 100,
                          message: "Tỷ lệ hoa hồng không được quá 100%",
                        },
                      }}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          placeholder="Nhập tỷ lệ hoa hồng"
                          size="large"
                          className="w-full"
                          min={0}
                          max={100}
                          formatter={(value) => `${value}%`}
                          parser={(value) => value?.replace("%", "")}
                        />
                      )}
                    />
                    {errors.commissionRate && (
                      <span className="text-red-500 text-sm">
                        {errors.commissionRate.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700 block">
                      Mô Tả Dịch Vụ *
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Vui lòng nhập mô tả dịch vụ" }}
                      render={({ field }) => (
                        <Input.TextArea
                          {...field}
                          rows={4}
                          placeholder="Nhập mô tả chi tiết về dịch vụ"
                          className="w-full resize-none"
                          size="large"
                        />
                      )}
                    />
                    {errors.description && (
                      <span className="text-red-500 text-sm">
                        {errors.description.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Ảnh Đại Diện
                    </label>
                    <Radio.Group
                      onChange={onChange}
                      value={value}
                      className="mb-4 flex flex-wrap gap-4">
                      <Radio value={1} className="flex items-center">
                        <FileImageOutlined className="text-lg text-blue-500 mr-2" />
                        <span>Chọn ảnh từ thiết bị</span>
                      </Radio>
                      <Radio value={2} className="flex items-center">
                        <LinkOutlined className="text-lg text-blue-500 mr-2" />
                        <span>Dùng URL ảnh</span>
                      </Radio>
                    </Radio.Group>
                    {value === 1 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                          <input
                            onChange={(e) => setFile(e.target.files[0])}
                            type="file"
                            accept="image/*"
                            name="cover"
                            id="cover"
                            className="hidden"
                          />
                          <label
                            htmlFor="cover"
                            className="cursor-pointer flex flex-col items-center justify-center h-32">
                            <FileImageOutlined className="text-3xl text-gray-400 mb-2" />
                            <div className="text-center">
                              <span className="text-sm font-medium text-gray-700 block">
                                Chọn ảnh
                              </span>
                              <span className="text-xs text-gray-500">
                                Hoặc kéo và thả ảnh vào đây
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          {file ? (
                            <div className="space-y-2">
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded"
                              />
                              <div className="flex items-center justify-between">
                                <div>
                                  <Text
                                    ellipsis
                                    className="text-sm font-medium">
                                    {file.name}
                                  </Text>
                                  <Text className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </Text>
                                </div>
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => setFile("")}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                              <FileImageOutlined style={{ fontSize: "24px" }} />
                              <span className="text-xs mt-2">
                                Xem trước ảnh
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Controller
                        name="img_url"
                        control={control}
                        rules={{
                          required:
                            value === 2 ? "Vui lòng nhập URL ảnh" : false,
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Nhập URL ảnh đại diện"
                            size="large"
                            prefix={<LinkOutlined className="text-gray-400" />}
                            className="w-full"
                          />
                        )}
                      />
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Trạng Thái *
                    </label>
                    <Radio.Group
                      onChange={onChangeStatus}
                      value={valueStatus}
                      className="flex gap-6">
                      <Radio value={true} className="flex items-center">
                        <CheckCircleOutlined className="text-lg text-green-500 mr-2" />
                        <span>Hoạt động</span>
                      </Radio>
                      <Radio value={false} className="flex items-center">
                        <StopOutlined className="text-lg text-red-500 mr-2" />
                        <span>Tạm ngưng</span>
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  size="large"
                  disabled={submitLoading}
                  onClick={() => {
                    setAddOpen(false);
                    resetForm();
                  }}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitLoading}
                  disabled={submitLoading}>
                  {submitLoading ? "Đang tạo..." : "Tạo Dịch Vụ"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Edit Service Modal */}
        <Modal
          title={
            <div className="flex items-center gap-3 text-blue-600 pb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <EditOutlined style={{ fontSize: "18px" }} />
              </div>
              <span className="text-lg font-medium">Chỉnh sửa dịch vụ</span>
            </div>
          }
          open={editOpen}
          width="90%"
          style={{
            top: 20,
            maxWidth: "1000px",
            width: "90vw",
          }}
          onCancel={() => {
            setEditOpen(false);
            resetEditForm();
          }}
          footer={null}
          centered
          styles={{ body: { padding: 0 } }}
          destroyOnClose
          className="edit-service-modal">
          <div className="modal-scrollable-content p-6">
            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 block">
                      Tên Dịch Vụ *
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Vui lòng nhập tên dịch vụ" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Nhập tên dịch vụ"
                          size="large"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-700 block">
                      Danh Mục *
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Vui lòng chọn danh mục" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Chọn danh mục"
                          size="large"
                          className="w-full">
                          {categories.map((category) => (
                            <Option key={category} value={category}>
                              {category}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <span className="text-red-500 text-sm">
                        {errors.category.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="text-sm font-medium text-gray-700 block">
                      Giá Dịch Vụ (VNĐ) *
                    </label>
                    <Controller
                      name="price"
                      control={control}
                      rules={{ required: "Vui lòng nhập giá dịch vụ" }}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          placeholder="Nhập giá dịch vụ"
                          size="large"
                          className="w-full"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          addonAfter="VNĐ"
                        />
                      )}
                    />
                    {errors.price && (
                      <span className="text-red-500 text-sm">
                        {errors.price.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="estimatedTime"
                      className="text-sm font-medium text-gray-700 block">
                      Thời Gian Ước Tính *
                    </label>
                    <Controller
                      name="estimatedTime"
                      control={control}
                      rules={{ required: "Vui lòng nhập thời gian ước tính" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="VD: 60 (phút)"
                          size="large"
                          className="w-full"
                          prefix={
                            <ClockCircleOutlined className="text-gray-400" />
                          }
                        />
                      )}
                    />
                    {errors.estimatedTime && (
                      <span className="text-red-500 text-sm">
                        {errors.estimatedTime.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="commissionRate"
                      className="text-sm font-medium text-gray-700 block">
                      Tỷ Lệ Hoa Hồng (%) *
                    </label>
                    <Controller
                      name="commissionRate"
                      control={control}
                      rules={{
                        required: "Vui lòng nhập tỷ lệ hoa hồng",
                        min: { value: 0, message: "Tỷ lệ hoa hồng phải từ 0%" },
                        max: {
                          value: 100,
                          message: "Tỷ lệ hoa hồng không được quá 100%",
                        },
                      }}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          placeholder="Nhập tỷ lệ hoa hồng"
                          size="large"
                          className="w-full"
                          min={0}
                          max={100}
                          formatter={(value) => `${value}%`}
                          parser={(value) => value?.replace("%", "")}
                        />
                      )}
                    />
                    {errors.commissionRate && (
                      <span className="text-red-500 text-sm">
                        {errors.commissionRate.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700 block">
                      Mô Tả Dịch Vụ *
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Vui lòng nhập mô tả dịch vụ" }}
                      render={({ field }) => (
                        <Input.TextArea
                          {...field}
                          rows={4}
                          placeholder="Nhập mô tả chi tiết về dịch vụ"
                          className="w-full resize-none"
                          size="large"
                        />
                      )}
                    />
                    {errors.description && (
                      <span className="text-red-500 text-sm">
                        {errors.description.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Ảnh Đại Diện
                    </label>
                    <Radio.Group
                      onChange={onChange}
                      value={value}
                      className="mb-4 flex flex-wrap gap-4">
                      <Radio value={1} className="flex items-center">
                        <FileImageOutlined className="text-lg text-blue-500 mr-2" />
                        <span>Chọn ảnh từ thiết bị</span>
                      </Radio>
                      <Radio value={2} className="flex items-center">
                        <LinkOutlined className="text-lg text-blue-500 mr-2" />
                        <span>Dùng URL ảnh</span>
                      </Radio>
                    </Radio.Group>
                    {value === 1 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                          <input
                            onChange={(e) => setEditFile(e.target.files[0])}
                            type="file"
                            accept="image/*"
                            name="editCover"
                            id="editCover"
                            className="hidden"
                          />
                          <label
                            htmlFor="editCover"
                            className="cursor-pointer flex flex-col items-center justify-center h-32">
                            <FileImageOutlined className="text-3xl text-gray-400 mb-2" />
                            <div className="text-center">
                              <span className="text-sm font-medium text-gray-700 block">
                                Chọn ảnh
                              </span>
                              <span className="text-xs text-gray-500">
                                Hoặc kéo và thả ảnh vào đây
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          {editFile ? (
                            <div className="space-y-2">
                              <img
                                src={URL.createObjectURL(editFile)}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded"
                              />
                              <div className="flex items-center justify-between">
                                <div>
                                  <Text
                                    ellipsis
                                    className="text-sm font-medium">
                                    {editFile.name}
                                  </Text>
                                  <Text className="text-xs text-gray-500">
                                    {(editFile.size / 1024).toFixed(1)} KB
                                  </Text>
                                </div>
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => setEditFile("")}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                              <FileImageOutlined style={{ fontSize: "24px" }} />
                              <span className="text-xs mt-2">
                                Xem trước ảnh
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Controller
                        name="img_url"
                        control={control}
                        rules={{
                          required:
                            value === 2 ? "Vui lòng nhập URL ảnh" : false,
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Nhập URL ảnh đại diện"
                            size="large"
                            prefix={<LinkOutlined className="text-gray-400" />}
                            className="w-full"
                          />
                        )}
                      />
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Trạng Thái *
                    </label>
                    <Radio.Group
                      onChange={onChangeStatus}
                      value={valueStatus}
                      className="flex gap-6">
                      <Radio value={true} className="flex items-center">
                        <CheckCircleOutlined className="text-lg text-green-500 mr-2" />
                        <span>Hoạt động</span>
                      </Radio>
                      <Radio value={false} className="flex items-center">
                        <StopOutlined className="text-lg text-red-500 mr-2" />
                        <span>Tạm ngưng</span>
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  size="large"
                  disabled={submitLoading}
                  onClick={() => {
                    setEditOpen(false);
                    resetEditForm();
                  }}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitLoading}
                  disabled={submitLoading}>
                  {submitLoading ? "Đang cập nhật..." : "Cập Nhật Dịch Vụ"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Delete Service Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-red-500">
              <ExclamationCircleOutlined />
              <span>Xác nhận xóa dịch vụ</span>
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
            <div className="flex items-center mb-4">
              <Avatar
                src={serviceId.img}
                size={48}
                shape="square"
                className="rounded-lg mr-3"
              />
              <div>
                <Text strong className="block ml-4">
                  {serviceId.name}
                </Text>
              </div>
            </div>
            <p className="text-gray-600">
              Dịch vụ này sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có
              chắc chắn muốn tiếp tục?
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Services;
