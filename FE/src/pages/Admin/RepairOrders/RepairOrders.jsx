import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  DatePicker,
  Descriptions,
  Badge,
  Timeline,
  message,
  Card,
  Row,
  Col,
} from "antd";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit2,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTool,
} from "react-icons/fi";
import Sidebar from "../../../components/SideBarAdmin/Sidebar";

const { Option } = Select;
const { RangePicker } = DatePicker;

function RepairOrders() {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();

  // Mock data cho danh sách đơn sửa chữa
  const orders = [
    {
      id: "DH001",
      customerName: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      service: "Sửa chữa điện lạnh",
      problem: "Máy lạnh không lạnh",
      status: "pending",
      technician: "Trần Văn B",
      scheduledTime: "2024-03-20 14:00",
      createdAt: "2024-03-19 10:30",
      estimatedCost: 500000,
      notes: "Khách hàng cần sửa gấp",
      timeline: [
        {
          time: "2024-03-19 10:30",
          status: "created",
          description: "Đơn hàng được tạo",
        },
        {
          time: "2024-03-19 11:00",
          status: "confirmed",
          description: "Đã xác nhận đơn hàng",
        },
      ],
    },
    {
      id: "DH002",
      customerName: "Trần Thị B",
      phone: "0907654321",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      service: "Sửa chữa điện tử",
      problem: "TV không lên hình",
      status: "in_progress",
      technician: "Lê Văn C",
      scheduledTime: "2024-03-21 09:00",
      createdAt: "2024-03-19 15:45",
      estimatedCost: 400000,
      notes: "Đã kiểm tra sơ bộ",
      timeline: [
        {
          time: "2024-03-19 15:45",
          status: "created",
          description: "Đơn hàng được tạo",
        },
      ],
    },
  ];

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    pending: "orange",
    confirmed: "blue",
    in_progress: "purple",
    completed: "green",
    cancelled: "red",
  };

  const statusLabels = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    in_progress: "Đang xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Thời gian hẹn",
      dataIndex: "scheduledTime",
      key: "scheduledTime",
      render: (text) => (
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} className="px-3 py-1">
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FiEye className="text-blue-600" />}
            onClick={() => handleViewDetail(record)}
          />
          <Button
            type="text"
            icon={<FiEdit2 className="text-green-600" />}
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
  ];

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      ...order,
      scheduledTime: order.scheduledTime ? order.scheduledTime : undefined,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateOrder = (values) => {
    console.log("Updated values:", values);
    message.success("Cập nhật đơn hàng thành công");
    setIsEditModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="bg-[#f5f8ff] min-h-screen">
      <div className="flex">
        <div className="flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0">
          <div className="min-h-svh">
            <div className="m-6 p-0">
              {/* Header */}
              <div className="flex justify-between items-center mb-3 pt-1">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Quản lý Đơn sửa chữa
                  </h1>
                  <p className="text-sm text-gray-600">
                    Tổng số {filteredOrders.length} đơn hàng
                  </p>
                </div>
              </div>

              {/* Search and Filter Section */}
              <Card className="mb-3">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <Input
                      placeholder="Tìm kiếm đơn hàng..."
                      prefix={<FiSearch className="text-gray-400" />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>

                  <Col xs={12} sm={8} md={6} lg={6}>
                    <Select
                      defaultValue="all"
                      style={{ width: "100%" }}
                      onChange={(value) => setFilterStatus(value)}
                      placeholder="Trạng thái">
                      <Option value="all">Tất cả trạng thái</Option>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <Option key={key} value={key}>
                          {label}
                        </Option>
                      ))}
                    </Select>
                  </Col>

                  <Col xs={12} sm={8} md={10} lg={10}>
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={["Từ ngày", "Đến ngày"]}
                    />
                  </Col>
                </Row>
              </Card>

              {/* Orders Table */}
              <Card>
                <Table
                  columns={columns}
                  dataSource={filteredOrders}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      <Modal
        title="Chi tiết đơn sửa chữa"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}>
        {selectedOrder && (
          <div className="space-y-6">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đơn" span={2}>
                {selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedOrder.address}
              </Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">
                {selectedOrder.service}
              </Descriptions.Item>
              <Descriptions.Item label="Kỹ thuật viên">
                {selectedOrder.technician}
              </Descriptions.Item>
              <Descriptions.Item label="Vấn đề" span={2}>
                {selectedOrder.problem}
              </Descriptions.Item>
              <Descriptions.Item label="Chi phí dự kiến">
                {selectedOrder.estimatedCost.toLocaleString("vi-VN")}đ
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge
                  status={statusColors[selectedOrder.status]}
                  text={statusLabels[selectedOrder.status]}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedOrder.notes}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <h3 className="font-medium mb-4">Lịch sử đơn hàng</h3>
              <Timeline
                items={selectedOrder.timeline.map((item) => ({
                  color: statusColors[item.status],
                  children: (
                    <div>
                      <div className="font-medium">{item.description}</div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Cập nhật đơn sửa chữa"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateOrder}
          className="mt-4">
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
            <Select>
              {Object.entries(statusLabels).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="technician"
            label="Kỹ thuật viên"
            rules={[
              { required: true, message: "Vui lòng chọn kỹ thuật viên" },
            ]}>
            <Select placeholder="Chọn kỹ thuật viên">
              <Option value="Trần Văn B">Trần Văn B</Option>
              <Option value="Lê Văn C">Lê Văn C</Option>
              <Option value="Phạm Văn D">Phạm Văn D</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="scheduledTime"
            label="Thời gian hẹn"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian hẹn" },
            ]}>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              className="w-full"
              placeholder="Chọn thời gian"
            />
          </Form.Item>

          <Form.Item
            name="estimatedCost"
            label="Chi phí dự kiến"
            rules={[
              { required: true, message: "Vui lòng nhập chi phí dự kiến" },
            ]}>
            <Input
              prefix={<FiDollarSign className="text-gray-400" />}
              type="number"
              placeholder="Nhập chi phí dự kiến"
            />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú về đơn hàng" />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button
              onClick={() => {
                setIsEditModalVisible(false);
                form.resetFields();
              }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default RepairOrders;
