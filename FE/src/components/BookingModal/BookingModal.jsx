import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Input,
  Select,
  Radio,
  DatePicker,
  TimePicker,
  Button,
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
import { getItems, addItems } from "../../services/custom.api";
import { UserContext } from "../../contexts/UserContext";
import { useNotification } from "../../contexts/NotificationContext";

const { TextArea } = Input;
const { Option } = Select;

function BookingModal({ isOpen, onClose, selectedService = null }) {
  const { userData } = useContext(UserContext);
  const { showNotification } = useNotification();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      service: selectedService?._id || "",
      technician: "",
      name: userData?.fullName || "",
      phone: userData?.phone || "",
      district: "",
      address: userData?.address || "",
      date: null,
      time: "",
      notes: "",
    },
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  useEffect(() => {
    getServices();
    getTechnician();
  }, []);

  useEffect(() => {
    if (selectedService) {
      setValue("service", selectedService._id);
    }
  }, [selectedService, setValue]);

  // Fill form từ userData khi có dữ liệu
  useEffect(() => {
    if (userData) {
      setValue("name", userData.fullName || "");
      setValue("phone", userData.phone || "");
      setValue("address", userData.address || "");
    }
  }, [userData, setValue]);

  const getServices = async () => {
    try {
      const res = await getItems("admin/get-services");
      console.log("BookingModal services:", res.data);
      setServices(res.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  const getTechnician = async () => {
    try {
      const res = await getItems("admin/get-all-technicians");
      console.log("BookingModal technicians:", res.data);
      setTechnicians(res.data || []);
    } catch (error) {
      console.error("Error fetching technicians:", error);
      setTechnicians([]);
    }
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

  const timeSlots = [
    "07:00 - 09:00",
    "09:00 - 11:00",
    "11:00 - 13:00",
    "13:00 - 15:00",
    "15:00 - 17:00",
    "17:00 - 19:00",
    "19:00 - 21:00",
  ];

  const onSubmit = async (data) => {
    try {
      // Format lại data trước khi submit
      const submitData = {
        ...data,
        date: data.date ? dayjs(data.date).format("YYYY-MM-DD") : null,
      };
      console.log(submitData);

      await addItems("booking/create-booking", submitData).then((res) => {
        if (res.status === 200) {
          setIsSubmitted(true);
          showNotification("success", "Đặt lịch thành công!");
          setTimeout(() => {
            onClose();
            setIsSubmitted(false);
            reset();
          }, 2000);
        } else {
          console.log(res.data);
          showNotification("error", res.data.message);
        }
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      showNotification("error", "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Disable dates before today
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Icon mapping for fallback
  const iconMap = {
    "Điện lạnh": <FaSnowflake className="text-2xl" />,
    "Điện gia dụng": <MdKitchen className="text-2xl" />,
    "Điện tử": <FaTv className="text-2xl" />,
    "Điện máy": <MdLocalLaundryService className="text-2xl" />,
    "Điện nước": <MdWaterDrop className="text-2xl" />,
    Khác: <AppstoreOutlined className="text-2xl" />,
  };

  // Color mapping for services
  const colorMap = {
    "Điện lạnh": "#1890ff",
    "Điện gia dụng": "#52c41a",
    "Điện tử": "#f5222d",
    "Điện máy": "#722ed1",
    "Điện nước": "#13c2c2",
    Khác: "#666666",
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Selection */}
          {!selectedService && (
            <div>
              <label className="block text-base mb-3">
                Chọn dịch vụ <span className="text-red-500">*</span>
              </label>
              <Controller
                name="service"
                control={control}
                rules={{ required: "Vui lòng chọn dịch vụ" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="Chọn dịch vụ"
                    className="w-full"
                    showSearch
                    optionFilterProp="children"
                    suffixIcon={<AppstoreOutlined />}
                    status={errors.service ? "error" : ""}
                    optionLabelProp="label">
                    {services.map((service) => (
                      <Option
                        key={service._id}
                        value={service._id}
                        label={service.name}>
                        <div className="flex items-center gap-3 py-2">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white overflow-hidden flex-shrink-0"
                            style={{
                              backgroundColor:
                                colorMap[service.category] || "#666666",
                            }}>
                            {service.images &&
                            service.images.length > 0 &&
                            service.images[0].url ? (
                              <img
                                src={service.images[0].url}
                                alt={service.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              iconMap[service.category] || <AppstoreOutlined />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {service.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {service.basePrice
                                ? `${service.basePrice.toLocaleString(
                                    "vi-VN"
                                  )}đ`
                                : "Liên hệ báo giá"}
                            </div>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.service && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.service.message}
                </p>
              )}
            </div>
          )}

          {/* Technician Selection */}
          <div>
            <label className="block text-base mb-3">
              Chọn kỹ thuật viên{" "}
              <span className="text-gray-400">(Tùy chọn)</span>
            </label>
            <Controller
              name="technician"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  placeholder="Chọn kỹ thuật viên (để trống nếu muốn hệ thống tự phân công)"
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  suffixIcon={<UserOutlined />}
                  allowClear
                  optionLabelProp="label">
                  {technicians.map((technician) => (
                    <Option
                      key={technician._id}
                      value={technician._id}
                      label={technician.fullName}>
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden flex-shrink-0">
                          {technician.account?.avatar ? (
                            <img
                              src={technician.account.avatar}
                              alt={technician.fullName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <UserOutlined />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {technician.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {technician.experience} năm kinh nghiệm •{" "}
                            {technician.district}
                          </div>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              )}
            />
            <p className="text-sm text-gray-500 mt-1">
              Nếu không chọn kỹ thuật viên, hệ thống sẽ tự động phân công phù
              hợp nhất
            </p>
          </div>

          {/* Selected Service Info */}
          {selectedService && (
            <div className="mb-6 bg-blue-50 rounded-lg p-4 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl overflow-hidden"
                style={{
                  backgroundColor:
                    colorMap[selectedService.category] || "#666666",
                }}>
                {selectedService.images &&
                selectedService.images.length > 0 &&
                selectedService.images[0].url ? (
                  <img
                    src={selectedService.images[0].url}
                    alt={selectedService.name}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    selectedService.images &&
                    selectedService.images.length > 0 &&
                    selectedService.images[0].url
                      ? "hidden"
                      : "flex"
                  }`}>
                  {iconMap[selectedService.category] || (
                    <AppstoreOutlined className="text-2xl" />
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">{selectedService.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedService.basePrice
                    ? `${selectedService.basePrice.toLocaleString("vi-VN")}đ`
                    : "Liên hệ báo giá"}
                </p>
              </div>
            </div>
          )}

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Vui lòng nhập họ tên" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<UserOutlined />}
                    placeholder="Nguyễn Văn A"
                    size="large"
                    status={errors.name ? "error" : ""}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Vui lòng nhập số điện thoại",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<PhoneOutlined />}
                    placeholder="0909 xxx xxx"
                    size="large"
                    status={errors.phone ? "error" : ""}
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base mb-2">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <Controller
                name="district"
                control={control}
                rules={{ required: "Vui lòng chọn quận/huyện" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Chọn quận/huyện"
                    size="large"
                    className="w-full"
                    showSearch
                    optionFilterProp="children"
                    suffixIcon={<EnvironmentOutlined />}
                    status={errors.district ? "error" : ""}>
                    {districts.map((district) => (
                      <Option key={district} value={district}>
                        {district}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base mb-2">
                Địa chỉ cụ thể <span className="text-red-500">*</span>
              </label>
              <Controller
                name="address"
                control={control}
                rules={{ required: "Vui lòng nhập địa chỉ" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<EnvironmentOutlined />}
                    placeholder="Số nhà, tên đường"
                    size="large"
                    status={errors.address ? "error" : ""}
                  />
                )}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base mb-2">
                Chọn ngày <span className="text-red-500">*</span>
              </label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Vui lòng chọn ngày" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    size="large"
                    className="w-full"
                    format="DD/MM/YYYY"
                    disabledDate={disabledDate}
                    placeholder="Chọn ngày"
                    locale={locale}
                    status={errors.date ? "error" : ""}
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base mb-2">
                Chọn giờ <span className="text-red-500">*</span>
              </label>
              <Controller
                name="time"
                control={control}
                rules={{ required: "Vui lòng chọn giờ" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    className="w-full"
                    placeholder="Chọn giờ"
                    suffixIcon={<ClockCircleOutlined />}
                    status={errors.time ? "error" : ""}>
                    {timeSlots.map((slot) => (
                      <Option key={slot} value={slot}>
                        {slot}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-base mb-2">Ghi chú thêm</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  prefix={<FileTextOutlined />}
                  placeholder="Mô tả thêm về tình trạng thiết bị hoặc yêu cầu đặc biệt (nếu có)"
                  rows={3}
                  showCount
                  maxLength={500}
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="h-12 bg-blue-600 hover:bg-blue-700">
              Đặt lịch ngay
            </Button>
          </div>
        </form>
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
