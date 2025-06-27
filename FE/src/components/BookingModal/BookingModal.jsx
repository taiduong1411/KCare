import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  TimePicker,
  Button,
  message,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloudOutlined,
  BoxPlotOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
  FireOutlined,
  AppstoreOutlined,
  BulbOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { FaSnowflake, FaTv, FaFan, FaFireAlt } from "react-icons/fa";
import {
  MdKitchen,
  MdLocalLaundryService,
  MdMicrowave,
  MdWaterDrop,
} from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/locale/vi_VN";

const { TextArea } = Input;
const { Option } = Select;

function BookingModal({ isOpen, onClose, selectedService = null }) {
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    "Quận Bình Tân",
    "Quận Bình Thạnh",
    "Quận Gò Vấp",
    "Quận Phú Nhuận",
    "Quận Tân Bình",
    "Quận Tân Phú",
    "Quận Thủ Đức",
    "Huyện Bình Chánh",
    "Huyện Cần Giờ",
    "Huyện Củ Chi",
    "Huyện Hóc Môn",
    "Huyện Nhà Bè",
  ];

  const services = [
    {
      id: 1,
      name: "Máy lạnh",
      icon: <CloudOutlined className="text-2xl" />,
      color: "#1890ff",
    },
    {
      id: 2,
      name: "Tủ lạnh",
      icon: <BoxPlotOutlined className="text-2xl" />,
      color: "#52c41a",
    },
    {
      id: 3,
      name: "Máy giặt",
      icon: <AppstoreOutlined className="text-2xl" />,
      color: "#722ed1",
    },
    {
      id: 4,
      name: "Tivi",
      icon: <DesktopOutlined className="text-2xl" />,
      color: "#f5222d",
    },
    {
      id: 5,
      name: "Bình nóng lạnh",
      icon: <FireOutlined className="text-2xl" />,
      color: "#fa8c16",
    },
    {
      id: 6,
      name: "Lò vi sóng",
      icon: <ThunderboltOutlined className="text-2xl" />,
      color: "#faad14",
    },
    {
      id: 7,
      name: "Quạt điện",
      icon: <BulbOutlined className="text-2xl" />,
      color: "#13c2c2",
    },
    {
      id: 8,
      name: "Máy lọc nước",
      icon: <ExperimentOutlined className="text-2xl" />,
      color: "#1677ff",
    },
  ];

  const timeSlots = [
    "07:00 - 09:00",
    "09:00 - 11:00",
    "11:00 - 13:00",
    "13:00 - 15:00",
    "15:00 - 17:00",
    "17:00 - 19:00",
    "19:00 - 21:00",
  ];

  const handleSubmit = async (values) => {
    console.log("Quick booking:", {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
    });
    setIsSubmitted(true);
    message.success("Đặt lịch thành công!");
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      form.resetFields();
    }, 2000);
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // Disable dates before today
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <Modal
      title={<span className="text-xl">Đặt lịch nhanh</span>}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={800}
      className="booking-modal"
      destroyOnClose>
      {!isSubmitted ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            service: selectedService?.id,
          }}>
          {/* Service Selection */}
          {!selectedService && (
            <Form.Item
              name="service"
              label={
                <span className="text-base">
                  Chọn dịch vụ <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}>
              <Radio.Group className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {services.map((service) => (
                    <Radio.Button
                      key={service.id}
                      value={service.id}
                      className="!h-auto !p-0 w-full">
                      <div className="p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <div
                          className="w-14 h-14 mx-auto mb-2 rounded-2xl flex items-center justify-center text-white text-2xl"
                          style={{ backgroundColor: service.color }}>
                          {service.icon}
                        </div>
                        <p className="text-sm font-medium">{service.name}</p>
                      </div>
                    </Radio.Button>
                  ))}
                </div>
              </Radio.Group>
            </Form.Item>
          )}

          {/* Selected Service Info */}
          {selectedService && (
            <div className="mb-6 bg-blue-50 rounded-lg p-4 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: selectedService.color }}>
                {selectedService.icon}
              </div>
              <div>
                <p className="font-semibold">{selectedService.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedService.price || "Liên hệ báo giá"}
                </p>
              </div>
            </div>
          )}

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={
                <span className="text-base">
                  Họ và tên <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="Nguyễn Văn A"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span className="text-base">
                  Số điện thoại <span className="text-red-500">*</span>
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}>
              <Input
                prefix={<PhoneOutlined />}
                placeholder="0909 xxx xxx"
                size="large"
              />
            </Form.Item>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="district"
              label={
                <span className="text-base">
                  Quận/Huyện <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}>
              <Select
                placeholder="Chọn quận/huyện"
                size="large"
                showSearch
                optionFilterProp="children">
                {districts.map((district) => (
                  <Option key={district} value={district}>
                    {district}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="address"
              label={
                <span className="text-base">
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="Số nhà, tên đường"
                size="large"
              />
            </Form.Item>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label={
                <span className="text-base">
                  Chọn ngày <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Vui lòng chọn ngày" }]}>
              <DatePicker
                size="large"
                className="w-full"
                format="DD/MM/YYYY"
                disabledDate={disabledDate}
                placeholder="Chọn ngày"
                locale={locale}
              />
            </Form.Item>

            <Form.Item
              name="time"
              label={
                <span className="text-base">
                  Chọn giờ <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Vui lòng chọn giờ" }]}>
              <Select
                size="large"
                placeholder="Chọn giờ"
                suffixIcon={<ClockCircleOutlined />}>
                {timeSlots.map((slot) => (
                  <Option key={slot} value={slot}>
                    {slot}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Notes */}
          <Form.Item name="notes" label="Ghi chú thêm">
            <TextArea
              prefix={<FileTextOutlined />}
              placeholder="Mô tả thêm về tình trạng thiết bị hoặc yêu cầu đặc biệt (nếu có)"
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="h-12 bg-blue-600 hover:bg-blue-700">
              Đặt lịch ngay
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="text-center py-8">
          <CheckCircleOutlined className="text-5xl text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Đặt lịch thành công!
          </h3>
          <p className="text-gray-600">
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận
            lịch hẹn.
          </p>
        </div>
      )}
    </Modal>
  );
}

export default BookingModal;
