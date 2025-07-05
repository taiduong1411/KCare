import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { getItems } from "../../../services/custom.api";
import {
  FiCheckCircle,
  FiClock,
  FiShield,
  FiTool,
  FiDollarSign,
  FiPhone,
  FiMapPin,
  FiStar,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import {
  FaSnowflake,
  FaTshirt,
  FaUtensils,
  FaTv,
  FaFire,
  FaWrench,
  FaTools,
  FaUserTie,
  FaRegHandshake,
} from "react-icons/fa";
import {
  MdLocalLaundryService,
  MdKitchen,
  MdSpeed,
  MdMicrowave,
} from "react-icons/md";
import { BiWater } from "react-icons/bi";

function Service() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPricing, setShowPricing] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  // Fetch services từ API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getItems("/admin/get-services");
        if (response.status === 200) {
          // Map dữ liệu từ API thành format mà component expect
          const mappedServices = response.data.map((service, index) => ({
            id: service._id,
            icon: getServiceIcon(service.category),
            name: service.name,
            category: getCategorySlug(service.category),
            description: service.description,
            features: getServiceFeatures(service.category),
            pricing: {
              basic: formatPrice(service.basePrice),
              detail: getServicePricingDetail(
                service.category,
                service.basePrice
              ),
            },
            time: `${service.duration} phút`,
            warranty: getServiceWarranty(service.category),
            color: getServiceColor(index),
          }));

          setServices(mappedServices);
        } else {
          setError("Không thể tải dữ liệu dịch vụ");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Lỗi khi tải dữ liệu dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Helper functions to map API data to component format
  const getServiceIcon = (category) => {
    const iconMap = {
      "Điện lạnh": <FaSnowflake className="text-4xl" />,
      "Điện gia dụng": <MdLocalLaundryService className="text-4xl" />,
      "Điện tử": <FaTv className="text-4xl" />,
      "Điện máy": <MdKitchen className="text-4xl" />,
      "Điện nước": <BiWater className="text-4xl" />,
      Khác: <FaTools className="text-4xl" />,
    };
    return iconMap[category] || <FaWrench className="text-4xl" />;
  };

  const getCategorySlug = (category) => {
    const categoryMap = {
      "Điện lạnh": "cooling",
      "Điện gia dụng": "laundry",
      "Điện tử": "electronics",
      "Điện máy": "kitchen",
      "Điện nước": "bathroom",
      Khác: "maintenance",
    };
    return categoryMap[category] || "maintenance";
  };

  const getServiceFeatures = (category) => {
    const featuresMap = {
      "Điện lạnh": [
        "Kiểm tra và sửa chữa máy không lạnh",
        "Nạp gas máy lạnh",
        "Vệ sinh máy lạnh định kỳ",
        "Sửa máy lạnh bị chảy nước",
        "Thay linh kiện chính hãng",
      ],
      "Điện gia dụng": [
        "Máy giặt không vào điện",
        "Không xả nước, không vắt",
        "Lồng giặt không quay",
        "Máy giặt kêu to bất thường",
        "Thay linh kiện chính hãng",
      ],
      "Điện tử": [
        "Màn hình không lên",
        "Hình ảnh bị sọc, nhiễu",
        "Không có âm thanh",
        "Remote không hoạt động",
        "Nâng cấp phần mềm Smart TV",
      ],
      "Điện máy": [
        "Tủ lạnh không lạnh",
        "Tủ lạnh bị đóng tuyết",
        "Chảy nước, kêu to",
        "Không vào điện",
        "Nạp gas tủ lạnh",
      ],
      "Điện nước": [
        "Không nóng nước",
        "Nước nóng yếu",
        "Rò rỉ điện",
        "Bị chập cháy",
        "Thay thanh nhiệt",
      ],
      Khác: [
        "Kiểm tra tổng quát",
        "Vệ sinh thiết bị",
        "Thay thế linh kiện hao mòn",
        "Tư vấn sử dụng đúng cách",
        "Lịch nhắc bảo trì",
      ],
    };
    return (
      featuresMap[category] || [
        "Dịch vụ chuyên nghiệp",
        "Thay linh kiện chính hãng",
      ]
    );
  };

  const getServicePricingDetail = (category, basePrice) => {
    const basePriceNum = parseInt(basePrice);
    return [
      { service: "Kiểm tra cơ bản", price: "Miễn phí nếu sửa" },
      {
        service: "Sửa chữa thông thường",
        price: `${formatPrice(basePriceNum)} - ${formatPrice(
          basePriceNum * 2
        )}`,
      },
      {
        service: "Thay linh kiện",
        price: `${formatPrice(basePriceNum * 2)} - ${formatPrice(
          basePriceNum * 4
        )}`,
      },
      {
        service: "Sửa chữa lớn",
        price: `${formatPrice(basePriceNum * 3)} - ${formatPrice(
          basePriceNum * 6
        )}`,
      },
    ];
  };

  const getServiceWarranty = (category) => {
    const warrantyMap = {
      "Điện lạnh": "6 tháng",
      "Điện gia dụng": "6 tháng",
      "Điện tử": "3 tháng",
      "Điện máy": "12 tháng",
      "Điện nước": "6 tháng",
      Khác: "3 tháng",
    };
    return warrantyMap[category] || "3 tháng";
  };

  const getServiceColor = (index) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-green-400 to-green-600",
      "from-indigo-400 to-indigo-600",
      "from-orange-400 to-orange-600",
      "from-red-400 to-red-600",
      "from-yellow-400 to-yellow-600",
      "from-gray-500 to-gray-700",
    ];
    return colors[index % colors.length];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const categories = [
    { id: "all", name: "Tất cả", icon: <FaWrench /> },
    { id: "cooling", name: "Làm lạnh", icon: <FaSnowflake /> },
    { id: "laundry", name: "Giặt giũ", icon: <FaTshirt /> },
    { id: "kitchen", name: "Nhà bếp", icon: <FaUtensils /> },
    { id: "electronics", name: "Điện tử", icon: <FaTv /> },
    { id: "bathroom", name: "Phòng tắm", icon: <BiWater /> },
    { id: "maintenance", name: "Bảo trì", icon: <FaTools /> },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const benefits = [
    {
      icon: <FiClock />,
      title: "Nhanh chóng",
      description: "Có mặt trong 30 phút",
    },
    {
      icon: <FiShield />,
      title: "Bảo hành",
      description: "Lên đến 12 tháng",
    },
    {
      icon: <FiDollarSign />,
      title: "Giá cạnh tranh",
      description: "Minh bạch, không phát sinh",
    },
    {
      icon: <FaUserTie />,
      title: "Chuyên nghiệp",
      description: "KTV có chứng chỉ",
    },
  ];

  const process = [
    {
      step: 1,
      title: "Tiếp nhận yêu cầu",
      description: "Gọi điện hoặc đặt lịch online",
      icon: <FiPhone />,
    },
    {
      step: 2,
      title: "KTV đến kiểm tra",
      description: "Kiểm tra và báo giá tại chỗ",
      icon: <FiMapPin />,
    },
    {
      step: 3,
      title: "Thực hiện sửa chữa",
      description: "Sửa chữa sau khi khách đồng ý",
      icon: <FiTool />,
    },
    {
      step: 4,
      title: "Bảo hành dịch vụ",
      description: "Cấp phiếu bảo hành chính thức",
      icon: <FiAward />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white pt-32 lg:pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Dịch vụ của <span className="text-blue-600">KCare</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Đa dạng dịch vụ sửa chữa và bảo trì thiết bị gia dụng tại nhà với
              đội ngũ kỹ thuật viên chuyên nghiệp
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="zoom-in"
                data-aos-delay={index * 100}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}>
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Đang tải dịch vụ...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="text-red-600 mb-4">
                <FiTool className="text-4xl mx-auto mb-2" />
                <p className="text-lg font-semibold">Có lỗi xảy ra</p>
                <p className="text-sm text-gray-600 mt-2">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}>
                  <div
                    className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                  <div className="p-8">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white mb-6 mx-auto`}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-6 text-center">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Info */}
                    <div className="border-t pt-6 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Giá từ:</span>
                        <span className="font-bold text-blue-600">
                          {service.pricing.basic}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Thời gian:
                        </span>
                        <span className="text-sm font-medium">
                          {service.time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bảo hành:</span>
                        <span className="text-sm font-medium">
                          {service.warranty}
                        </span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() =>
                          setShowPricing(
                            showPricing === service.id ? null : service.id
                          )
                        }
                        className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                        Xem bảng giá chi tiết
                      </button>
                      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium transform hover:scale-105">
                        Đặt lịch ngay
                      </button>
                    </div>

                    {/* Pricing Detail Dropdown */}
                    {showPricing === service.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Bảng giá chi tiết:
                        </h4>
                        <div className="space-y-2">
                          {service.pricing.detail.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">
                                {item.service}
                              </span>
                              <span className="font-medium text-gray-900">
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quy trình làm việc
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              4 bước đơn giản để được phục vụ tận nhà
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {process.map((item, index) => (
                <div
                  key={index}
                  className="text-center"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}>
                  <div className="bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-lg mb-6 relative">
                    <div className="text-3xl text-blue-600">{item.icon}</div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tại sao chọn dịch vụ của KCare?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUserTie className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Kỹ thuật viên chuyên nghiệp
                    </h3>
                    <p className="text-gray-600">
                      Đội ngũ được đào tạo bài bản, có chứng chỉ và kinh nghiệm
                      thực tế
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdSpeed className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Phản hồi nhanh chóng
                    </h3>
                    <p className="text-gray-600">
                      Có mặt trong 30 phút sau khi nhận yêu cầu, xử lý gọn gàng
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaRegHandshake className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Giá cả minh bạch
                    </h3>
                    <p className="text-gray-600">
                      Báo giá rõ ràng trước khi thực hiện, không phát sinh chi
                      phí
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiShield className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Bảo hành dài hạn
                    </h3>
                    <p className="text-gray-600">
                      Cam kết bảo hành lên đến 12 tháng cho dịch vụ và linh kiện
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-left">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full text-white mb-4">
                    <FiTrendingUp className="text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Thống kê dịch vụ
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Tổng dịch vụ/tháng</span>
                    <span className="font-bold text-2xl text-blue-600">
                      12,500+
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Đánh giá 5 sao</span>
                    <span className="font-bold text-2xl text-yellow-500">
                      98%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Thời gian phản hồi TB</span>
                    <span className="font-bold text-2xl text-green-600">
                      28 phút
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Khách hàng quay lại</span>
                    <span className="font-bold text-2xl text-purple-600">
                      85%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
          data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần sửa chữa ngay? Chúng tôi sẵn sàng!
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Đội ngũ kỹ thuật viên KCare luôn sẵn sàng phục vụ bạn 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
              <FiPhone />
              Gọi ngay: 1900 xxxx
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Đặt lịch online
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Service;
