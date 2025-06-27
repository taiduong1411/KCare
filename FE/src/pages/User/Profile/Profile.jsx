import { useState, useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { UserContext } from "../../../contexts/UserContext";
import { putItems } from "../../../services/custom.api";
import { useNotification } from "../../../contexts/NotificationContext";
import upload from "../../../services/cloudinary";

// Icons for input fields
const UserIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const EmailIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const LocationIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Add password icon
const PasswordIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function Profile() {
  const { userData, updateUserData } = useContext(UserContext);
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    }
  }, [userData]);

  const onSubmit = async (data) => {
    let avatarUrl = null;
    if (!file) {
      avatarUrl = userData.avatar;
    } else {
      const cloudinary = await upload(file, "KCare/avatar");
      avatarUrl = cloudinary.url;
    }
    try {
      const res = await putItems("/account/update-user-info", {
        ...data,
        avatar: avatarUrl ? avatarUrl : userData.avatar,
      });
      if (res.status === 200) {
        showNotification("success", res.data.msg);
        await updateUserData();
        setIsEditing(false);
      } else {
        showNotification("error", res.data.msg);
      }
    } catch (error) {
      showNotification("error", "Có lỗi xảy ra khi cập nhật thông tin");
      console.error("Error updating user info:", error);
    }
  };

  const handleCancel = () => {
    reset({
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
    });
    setAvatarPreview(null);
    setIsEditing(false);
    setFile("");
  };

  const [orders] = useState([
    {
      id: "DH001",
      date: "2024-03-15",
      service: "Sửa điều hòa",
      technician: "Kỹ thuật viên A",
      status: "completed",
      total: "500.000",
    },
    {
      id: "DH002",
      date: "2024-03-14",
      service: "Sửa máy giặt",
      technician: "Kỹ thuật viên B",
      status: "pending",
      total: "400.000",
    },
    {
      id: "DH003",
      date: "2024-03-13",
      service: "Sửa tủ lạnh",
      technician: "Kỹ thuật viên C",
      status: "cancelled",
      total: "600.000",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800";
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const InputField = ({
    label,
    type,
    error,
    icon: Icon,
    disabled: forcedDisabled,
    className,
    append,
    ...props
  }) => {
    const isDisabled = forcedDisabled || (!isEditing && type !== "email");

    return (
      <div className="relative group">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Icon
                className={`h-5 w-5 transition-colors duration-300 ${
                  isDisabled
                    ? "text-slate-400"
                    : error
                    ? "text-red-500"
                    : "text-slate-500 group-focus-within:text-blue-600"
                }`}
                aria-hidden="true"
              />
            </div>
          )}
          <input
            type={type}
            className={`
              block w-full rounded-xl text-base font-medium backdrop-blur-sm
              ${Icon ? "pl-12" : "pl-4"} 
              ${append ? "pr-12" : "pr-4"}
              py-3
              transition-all duration-300
              ${
                isDisabled
                  ? "bg-slate-100/80 text-slate-500 cursor-not-allowed border-2 border-slate-200"
                  : "bg-white/80 text-slate-900 border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              }
              ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50"
                  : ""
              }
              shadow-lg hover:shadow-xl focus:shadow-xl
              placeholder:text-slate-400
              disabled:opacity-75
              ${className || ""}
            `}
            disabled={isDisabled}
            {...props}
          />
          {append}
          {error && !append && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="h-6 w-6 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <p
            className="mt-3 text-sm text-red-600 font-medium flex items-center gap-2"
            role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error.message}
          </p>
        )}
      </div>
    );
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification("error", "Vui lòng chọn file ảnh");
      return;
    }
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Kích thước ảnh không được vượt quá 5MB");
      return;
    }
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-36 pb-12 relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm border border-blue-200/50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span>Tài khoản cá nhân</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 leading-tight">
            Tài khoản của tôi
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Quản lý thông tin cá nhân và theo dõi đơn hàng của bạn một cách
            <span className="text-blue-600 font-semibold"> dễ dàng</span> và
            <span className="text-emerald-600 font-semibold"> hiệu quả</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-2">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                } flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`${
                  activeTab === "orders"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                } flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Lịch sử đơn hàng
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
            <div className="p-10 sm:p-12">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-8 lg:space-y-0 lg:space-x-12 pb-10 border-b border-slate-200/50">
                <div className="relative group">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <img
                      src={
                        avatarPreview ||
                        userData?.avatar ||
                        "/default-avatar.png"
                      }
                      alt="Profile"
                      className="relative w-full h-full rounded-full object-cover ring-4 ring-white shadow-2xl border-4 border-white/50"
                    />
                    {isEditing && (
                      <button
                        onClick={triggerFileInput}
                        className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                        <div className="text-center transform group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="h-10 w-10 text-white mx-auto mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-white text-sm font-semibold block">
                            Thay đổi ảnh
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                      {userData?.fullName || "Chưa cập nhật"}
                    </h2>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200/50">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Khách hàng thường
                      </span>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Đã xác thực
                      </span>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <span>Chỉnh sửa thông tin</span>
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                <div className="grid grid-cols-1 gap-y-6">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <InputField
                      label="Họ và tên"
                      type="text"
                      icon={UserIcon}
                      error={errors.fullName}
                      {...register("fullName", {
                        required: "Vui lòng nhập họ tên",
                        minLength: {
                          value: 2,
                          message: "Họ tên phải có ít nhất 2 ký tự",
                        },
                      })}
                    />
                    <InputField
                      label="Email"
                      type="email"
                      icon={EmailIcon}
                      error={errors.email}
                      disabled={true}
                      {...register("email")}
                    />

                    <InputField
                      label="Số điện thoại"
                      type="tel"
                      icon={PhoneIcon}
                      error={errors.phone}
                      {...register("phone", {
                        required: "Vui lòng nhập số điện thoại",
                        pattern: {
                          value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      })}
                    />
                    <InputField
                      label="Địa chỉ"
                      type="text"
                      icon={LocationIcon}
                      error={errors.address}
                      {...register("address", {
                        required: "Vui lòng nhập địa chỉ",
                        minLength: {
                          value: 10,
                          message: "Địa chỉ phải có ít nhất 10 ký tự",
                        },
                      })}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Hủy</span>
                    </button>
                    <button
                      type="submit"
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Lưu thay đổi</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Chưa có đơn hàng nào
                </h3>
                <p className="text-slate-600 mb-6">
                  Bạn chưa có đơn hàng nào. Hãy đặt dịch vụ đầu tiên!
                </p>
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                  Đặt dịch vụ ngay
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map((order, index) => (
                  <div
                    key={order.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4z"
                                  clipRule="evenodd"
                                />
                                <path d="M10 5a2 2 0 012-2h3a1 1 0 011 1v6a3 3 0 01-3 3h-2V5z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">
                                #{order.id}
                              </h3>
                              <p className="text-slate-600 font-medium">
                                {new Date(order.date).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-1">
                                Dịch vụ
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {order.service}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-1">
                                Kỹ thuật viên
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {order.technician}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end">
                          <div className="text-center lg:text-right">
                            <p className="text-sm font-semibold text-slate-500 mb-2">
                              Tổng tiền
                            </p>
                            <p className="text-3xl font-black text-emerald-600">
                              {order.total} đ
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <span
                              className={`px-6 py-3 inline-flex items-center justify-center text-sm font-bold rounded-2xl border-2 ${getStatusColor(
                                order.status
                              )} ${
                                order.status === "completed"
                                  ? "border-green-200"
                                  : order.status === "pending"
                                  ? "border-yellow-200"
                                  : "border-red-200"
                              }`}>
                              {getStatusText(order.status)}
                            </span>

                            <button className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                              <span>Chi tiết</span>
                              <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`h-2 bg-gradient-to-r ${
                        order.status === "completed"
                          ? "from-green-400 to-emerald-500"
                          : order.status === "pending"
                          ? "from-yellow-400 to-orange-500"
                          : "from-red-400 to-pink-500"
                      } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
