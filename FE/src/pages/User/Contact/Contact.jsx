import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addItems, getItems } from "../../../services/custom.api";
import { motion } from "framer-motion"; // eslint-disable-line
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useNotification } from "../../../contexts/NotificationContext";

function Contact() {
  const [formStatus, setFormStatus] = useState("idle");
  const { showNotification } = useNotification();
  const [services, setServices] = useState([]);
  useEffect(() => {
    getServices();
  }, []);
  const getServices = async () => {
    await getItems("admin/get-services").then((res) => {
      setServices(res.data);
    });
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setFormStatus("submitting");

    try {
      const res = await addItems("contact/contact-us", data);
      showNotification(res.status === 200 ? "success" : "error", res.data.msg);
      setFormStatus(res.status === 200 ? "success" : "error");
      if (res.status === 200) {
        reset();
        setTimeout(() => {
          setFormStatus("idle");
        }, 3000);
      }
    } catch {
      setFormStatus("error");
      showNotification("error", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const contactMethods = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Hotline 24/7",
      content: "+84 86 54 216 07",
      description: "Hỗ trợ khách hàng 24/7",
      color: "bg-blue-500",
      link: "tel:+84865421607",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email",
      content: "support@kcare.vn",
      description: "Phản hồi trong 1-2 giờ",
      color: "bg-green-500",
      link: "mailto:support@kcare.vn",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Địa chỉ",
      content: "Quận 7, TP.HCM",
      description: "Trụ sở chính",
      color: "bg-purple-500",
      link: "#",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Giờ làm việc",
      content: "24/7",
      description: "Liên hệ 24/7",
      color: "bg-orange-500",
    },
  ];

  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Phản hồi nhanh",
      description: "Cam kết phản hồi trong vòng 30 phút",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Chuyên nghiệp",
      description: "Đội ngũ kỹ thuật viên giàu kinh nghiệm",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      title: "Giá cả hợp lý",
      description: "Chi phí minh bạch, không phát sinh",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-32 lg:pt-40 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-blue-500 bg-opacity-20 text-blue-100 text-sm font-medium rounded-full mb-6 backdrop-blur-sm border border-blue-400 border-opacity-30">
              🛠️ Dịch vụ sửa chữa chuyên nghiệp
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy để lại thông tin để
              nhận được dịch vụ sửa chữa tốt nhất với chi phí hợp lý nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+84865421607"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Gọi ngay
              </a>
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Gửi yêu cầu
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nhiều Cách Để Liên Hệ
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chọn cách thức liên hệ phù hợp nhất với bạn
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group">
                {method.link ? (
                  <a
                    href={method.link}
                    target={
                      method.link.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      method.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="block bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 ${method.color} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {method.content}
                    </p>
                    <p className="text-gray-500">{method.description}</p>
                  </a>
                ) : (
                  <div className="block bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 ${method.color} text-white rounded-xl mb-6`}>
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {method.content}
                    </p>
                    <p className="text-gray-500">{method.description}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section id="contact-form" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Success overlay */}
                {formStatus === "success" && (
                  <motion.div
                    className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-20 px-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <svg
                        className="w-10 h-10 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                      Cảm ơn bạn đã liên hệ!
                    </h3>
                    <p className="text-gray-600 text-center max-w-sm leading-relaxed">
                      Chúng tôi đã nhận được yêu cầu và sẽ liên hệ lại với bạn
                      trong thời gian sớm nhất.
                    </p>
                  </motion.div>
                )}

                <div className="p-8 lg:p-12">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Gửi Yêu Cầu Hỗ Trợ
                    </h2>
                    <p className="text-gray-600">
                      Điền thông tin bên dưới và chúng tôi sẽ liên hệ với bạn
                      ngay lập tức
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="fullname"
                          className="block text-sm font-semibold text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          placeholder="Nhập họ và tên"
                          {...register("fullname", {
                            required: "Vui lòng nhập họ và tên",
                          })}
                          className={`w-full px-4 py-4 rounded-xl border-2 ${
                            errors.fullname
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white`}
                        />
                        {errors.fullname && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.fullname.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="Nhập số điện thoại"
                          {...register("phone", {
                            required: "Vui lòng nhập số điện thoại",
                          })}
                          className={`w-full px-4 py-4 rounded-xl border-2 ${
                            errors.phone
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white`}
                        />
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        {...register("email", {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Địa chỉ email không hợp lệ",
                          },
                        })}
                        className={`w-full px-4 py-4 rounded-xl border-2 ${
                          errors.email
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        } focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white`}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="service"
                        className="block text-sm font-semibold text-gray-700 mb-2">
                        Dịch vụ cần hỗ trợ
                      </label>
                      <select
                        id="service"
                        {...register("service")}
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white">
                        <option value="">Chọn dịch vụ</option>
                        {services?.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-700 mb-2">
                        Mô tả chi tiết *
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Mô tả chi tiết vấn đề cần hỗ trợ..."
                        {...register("message", {
                          required: "Vui lòng mô tả vấn đề cần hỗ trợ",
                        })}
                        className={`w-full px-4 py-4 rounded-xl border-2 ${
                          errors.message
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        } focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white resize-none`}
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start">
                      <input
                        id="agree"
                        type="checkbox"
                        {...register("agree", {
                          required: "Vui lòng đồng ý với điều khoản",
                        })}
                        className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-blue-500 text-blue-600 mt-1"
                      />
                      <label
                        htmlFor="agree"
                        className="ml-3 text-sm text-gray-600">
                        Tôi đồng ý với{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-medium">
                          điều khoản dịch vụ
                        </a>{" "}
                        và{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-medium">
                          chính sách bảo mật
                        </a>
                      </label>
                    </div>
                    {errors.agree && (
                      <p className="text-sm text-red-600">
                        {errors.agree.message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className={`w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:shadow-lg ${
                        formStatus === "submitting"
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:-translate-y-1 hover:from-blue-700 hover:to-indigo-700"
                      }`}>
                      {formStatus === "submitting" ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang gửi...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          Gửi yêu cầu
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Features & Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Tại Sao Chọn K-Care?
                </h3>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center mr-6">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-6 text-center">
                  Thống Kê Dịch Vụ
                </h4>
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">1000+</div>
                    <div className="text-blue-100">Khách hàng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">24/7</div>
                    <div className="text-blue-100">Hỗ trợ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">98%</div>
                    <div className="text-blue-100">Hài lòng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">5⭐</div>
                    <div className="text-blue-100">Đánh giá</div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-red-800">
                      Cần Hỗ Trợ Khẩn Cấp?
                    </h4>
                    <p className="text-red-600">Liên hệ ngay hotline 24/7</p>
                  </div>
                </div>
                <a
                  href="tel:+84865421607"
                  className="block w-full text-center py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors duration-200">
                  Gọi ngay: +84 86 54 216 07
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những thắc mắc phổ biến từ khách hàng
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "Thời gian phản hồi yêu cầu sửa chữa là bao lâu?",
                answer:
                  "Chúng tôi cam kết phản hồi trong vòng 30 phút kể từ khi nhận được yêu cầu. Đối với các trường hợp khẩn cấp, thời gian này có thể nhanh hơn.",
              },
              {
                question: "Có tính phí tư vấn không?",
                answer:
                  "Tư vấn qua điện thoại và đánh giá sơ bộ hoàn toàn miễn phí. Chỉ tính phí khi bạn đồng ý sử dụng dịch vụ sửa chữa.",
              },
              {
                question: "Có bảo hành cho dịch vụ sửa chữa không?",
                answer:
                  "Có, chúng tôi bảo hành từ 3-12 tháng tùy theo loại dịch vụ và linh kiện thay thế. Bảo hành bao gồm cả phí công và phí thay thế.",
              },
              {
                question: "Có hỗ trợ sửa chữa tại nhà không?",
                answer:
                  "Có, chúng tôi cung cấp dịch vụ sửa chữa tại nhà với phí di chuyển hợp lý. Kỹ thuật viên sẽ mang theo đầy đủ dụng cụ và linh kiện cần thiết.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-semibold text-gray-900 hover:bg-gray-100 transition-colors duration-200">
                    <span className="text-lg">{faq.question}</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
